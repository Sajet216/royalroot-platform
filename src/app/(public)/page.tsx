'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'
import { ArrowRight, MoveDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Suspense } from 'react'

function HomeContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeCategory = searchParams.get('category')

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', activeCategory],
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
    <div className="bg-background overflow-x-hidden">
      {/* Editorial Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.png" 
            alt="RoyalRoot Interiors" 
            fill 
            priority
            className="object-cover brightness-[0.85] scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background/40" />
        </div>
        
        <div className="relative z-10 text-center space-y-10 max-w-5xl px-6">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80 block">Established Heritage</span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85]">
              Architectural <br />
              <span className="italic opacity-90">Silence.</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto font-medium leading-relaxed">
              Curating spaces that breathe. A collection of bespoke furniture designed for the discerning eye.
            </p>
            <div className="flex gap-4">
              <Link href="#collection">
                <button className="bg-white text-primary px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-500 shadow-2xl">
                  Explore Registry
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-[9px] font-bold uppercase tracking-widest">Scroll to Begin</span>
          <MoveDown className="w-4 h-4" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 md:py-60 bg-[#faf9f6]">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8 max-w-xl">
              <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">The Philosophy</span>
              <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight">
                The beauty of what remains <span className="italic">unsaid.</span>
              </h2>
              <p className="text-lg text-primary/60 leading-relaxed font-medium">
                We believe that furniture is more than utility; it is the physical manifestation of heritage. Our design system, Architectural Silence, prioritizes the tactile beauty of materials—solid oak, aged velvet, and hand-forged brass—ensuring every piece is a cornerstone of your home.
              </p>
              <Link href="/about" className="inline-flex items-center gap-3 group">
                <span className="text-primary font-bold uppercase tracking-widest text-[11px] border-b border-primary/10 pb-1 group-hover:border-primary transition-all">Discover Our Craft</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative aspect-[3/4] bg-muted overflow-hidden group">
              <Image 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" 
                alt="Craftsmanship" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="collection" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Registry</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary">Featured Acquisitions</h2>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {categories.map(cat => {
                const isActive = (cat === 'All' && !activeCategory) || activeCategory === cat.toLowerCase().replace(' room', '') || activeCategory === cat.toLowerCase();
                const slug = cat.toLowerCase().replace(' room', '');
                
                return (
                  <Link 
                    key={cat} 
                    href={cat === 'All' ? '/shop' : `/category/${slug}`}
                    className={`text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-500 border inline-block ${
                      isActive 
                        ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                        : 'bg-transparent text-primary/40 border-primary/5 hover:border-primary/20 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-6">
                  <div className="aspect-[4/5] bg-muted animate-pulse" />
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
            <div className="text-center py-40 border border-dashed border-primary/10 rounded-xl">
              <p className="font-serif italic text-primary/40 text-xl">The {activeCategory} collection is currently private.</p>
              <button 
                onClick={() => setCategory('all')}
                className="mt-6 text-[11px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/20 pb-1 hover:border-secondary transition-all"
              >
                View Full Archive
              </button>
            </div>
          )}

          <div className="mt-32 flex justify-center">
            <Link href="/shop">
              <button className="group flex flex-col items-center gap-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary transition-all group-hover:tracking-[0.6em]">View Full Archive</span>
                <div className="w-12 h-px bg-primary/20 group-hover:w-24 transition-all duration-500" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Footer Section */}
      <section className="py-40 bg-primary text-white">
        <div className="container mx-auto px-6 text-center space-y-16">
          <h2 className="text-5xl md:text-8xl font-serif leading-none tracking-tighter">
            Elevate your <span className="italic text-secondary">environment.</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
            <Link href="/signup">
              <button className="bg-secondary text-white px-12 py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-500">
                Join the Registry
              </button>
            </Link>
            <Link href="/contact" className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all">
              Request Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  )
}
