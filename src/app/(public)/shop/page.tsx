'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'
import { Search, SlidersHorizontal, Package } from 'lucide-react'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

function ShopContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeCategory = searchParams.get('category')
  const [localSearch, setLocalSearch] = useState('')

  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products', activeCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (activeCategory && activeCategory !== 'all') {
        query = query.ilike('category', `%${activeCategory}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    }
  })

  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (!localSearch) return products
    return products.filter(p => 
      p.name.toLowerCase().includes(localSearch.toLowerCase()) || 
      p.description.toLowerCase().includes(localSearch.toLowerCase())
    )
  }, [products, localSearch])

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'all') {
      params.delete('category')
    } else {
      params.set('category', cat.toLowerCase())
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const categories = ['All', 'Living Room', 'Dining Room', 'Bedroom', 'Office']

  return (
    <div className="bg-background min-h-screen pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="space-y-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-secondary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Masterpiece Registry</p>
              </div>
              <h1 className="text-5xl lg:text-8xl font-serif text-primary tracking-tighter leading-none">Full Archive.</h1>
            </div>
            <p className="text-lg text-primary/40 font-medium max-w-sm">
              The complete RoyalRoot collection. A comprehensive archive of architectural heritage and bespoke design.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-b border-primary/5 py-8">
            <div className="flex flex-wrap gap-4">
              {categories.map(cat => {
                const isActive = (cat === 'All' && !activeCategory) || activeCategory === cat.toLowerCase().replace(' room', '') || activeCategory === cat.toLowerCase();
                const slug = cat.toLowerCase().replace(' room', '');
                
                return (
                  <Link 
                    key={cat} 
                    href={cat === 'All' ? '/shop' : `/category/${slug}`}
                    className={`text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-none transition-all duration-500 border inline-block ${
                      isActive 
                        ? 'bg-primary text-white shadow-xl scale-105 border-primary' 
                        : 'bg-white border-primary/5 text-primary/40 hover:text-primary hover:border-primary/20'
                    }`}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
            
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
              <input 
                type="text" 
                placeholder="Search Archive..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-white border border-primary/5 px-12 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-6">
                <div className="aspect-[4/5] bg-muted animate-pulse rounded-none" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-muted animate-pulse" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 animate-in fade-in duration-700">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-primary/10">
            <Package className="w-12 h-12 text-primary/10 mx-auto mb-6" />
            <p className="font-serif italic text-primary/40 text-xl">No masterpieces match your criteria.</p>
            <button 
              onClick={() => { setCategory('all'); setLocalSearch(''); }}
              className="mt-6 text-[11px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/20 pb-1 hover:border-secondary transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="mt-40 border-t border-primary/5 pt-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/20">End of Archive</p>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  )
}
