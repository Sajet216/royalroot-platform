'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'
import { Package, ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function CategoryContent() {
  const supabase = createClient()
  const { slug } = useParams()
  const router = useRouter()

  if (slug === 'all') {
    router.replace('/shop')
    return null
  }

  const categoryMap: Record<string, string> = {
    'living': 'Living Room',
    'dining': 'Dining Room',
    'bedroom': 'Bedroom',
    'office': 'Office'
  }

  const categoryName = categoryMap[slug as string] || (slug as string).charAt(0).toUpperCase() + (slug as string).slice(1)

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (slug && slug !== 'all') {
        query = query.ilike('category', `%${slug}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    }
  })

  return (
    <div className="bg-background min-h-screen pt-20">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link 
            href="/#collection" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-secondary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Categorized Heritage</p>
              </div>
              <h1 className="text-5xl lg:text-8xl font-serif text-primary tracking-tighter leading-none">{categoryName}.</h1>
            </div>
            <p className="text-lg text-primary/40 font-medium max-w-sm">
              Bespoke {categoryName} acquisitions. A curated selection of architectural pieces for your refined spaces.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-6">
                <div className="aspect-[4/5] bg-muted animate-pulse rounded-none" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-muted animate-pulse" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 animate-in fade-in duration-700">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-primary/10">
            <Package className="w-12 h-12 text-primary/10 mx-auto mb-6" />
            <p className="font-serif italic text-primary/40 text-xl">The {categoryName} collection is currently private.</p>
            <Link 
              href="/shop"
              className="mt-6 inline-block text-[11px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/20 pb-1 hover:border-secondary transition-all"
            >
              View Full Archive
            </Link>
          </div>
        )}

        <div className="mt-40 border-t border-primary/5 pt-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/20">End of {categoryName} Archive</p>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CategoryContent />
    </Suspense>
  )
}
