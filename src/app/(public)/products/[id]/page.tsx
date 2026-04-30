'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Ruler, ShieldCheck, Truck, Check } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const supabase = createClient()
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Product
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="aspect-[4/5] bg-muted animate-pulse rounded-sm" />
          <div className="space-y-8">
            <div className="h-4 w-24 bg-muted animate-pulse" />
            <div className="h-12 w-3/4 bg-muted animate-pulse" />
            <div className="h-6 w-1/4 bg-muted animate-pulse" />
            <div className="space-y-4 pt-12">
              {[1, 2, 3].map(i => <div key={i} className="h-12 w-full bg-muted animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-40 text-center space-y-6">
        <h1 className="text-4xl font-serif text-primary">Piece not found.</h1>
        <p className="text-muted-foreground italic">The item you are looking for is currently unavailable in our registry.</p>
        <Button variant="outline" onClick={() => window.history.back()}>Return to Collection</Button>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-16 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* Editorial Image Gallery */}
          <div className="w-full space-y-4">
            {product.images && product.images.length > 0 ? (
              <Carousel className="w-full group">
                <CarouselContent>
                  {product.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                        <Image 
                          src={img} 
                          alt={`${product.name} - Image ${index + 1}`} 
                          fill 
                          priority={index === 0}
                          className="object-cover transition-transform duration-1000 hover:scale-105" 
                        />
                        <div className="absolute inset-0 border-[1px] border-black/5 pointer-events-none" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur" />
                    <CarouselNext className="right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-[4/5] bg-muted flex items-center justify-center text-muted-foreground italic font-serif">
                Imagery pending for this masterpiece.
              </div>
            )}
          </div>

          {/* Curated Product Details */}
          <div className="flex flex-col space-y-10 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
                  {product.category}
                </p>
                <Badge variant={product.is_available ? 'outline' : 'secondary'} className="rounded-full text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                  {product.is_available ? 'Available' : 'Reserved'}
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif text-primary tracking-tighter leading-none">{product.name}</h1>
              <div className="flex items-baseline space-x-6">
                <p className="text-3xl font-serif text-primary/80">${product.price.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 border-l border-primary/10 pl-6">
                  {product.stock_quantity ?? 0} Units in Registry
                </p>
              </div>
            </div>

            <div className="prose prose-neutral max-w-none">
              <p className="text-lg leading-relaxed text-primary/60 font-medium">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 pt-10 border-t border-primary/5">
              <div className="flex items-center space-x-3 text-primary/80">
                <Ruler className="w-4 h-4 text-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Specifications</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-3 border-b border-primary/5">
                  <span className="text-xs text-muted-foreground font-medium">Dimensions</span>
                  <span className="text-sm font-semibold">{product.dimensions}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-primary/5">
                  <span className="text-xs text-muted-foreground font-medium">Materiality</span>
                  <span className="text-sm font-semibold italic">Hand-selected Premium Finish</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-8">
              <div className="flex items-start space-x-3 p-4 bg-[#f4f3f1] rounded-sm">
                <Truck className="w-4 h-4 text-secondary mt-0.5" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary">White-Glove</p>
                  <p className="text-[10px] text-muted-foreground">Premium Handling</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-[#f4f3f1] rounded-sm">
                <ShieldCheck className="w-4 h-4 text-secondary mt-0.5" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Authentic</p>
                  <p className="text-[10px] text-muted-foreground">Certified Heritage</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <Button 
                size="lg" 
                className={`w-full h-16 text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all duration-500 shadow-xl ${isAdded ? 'bg-secondary hover:bg-secondary' : 'bg-primary hover:bg-secondary'}`} 
                disabled={!product.is_available || isAdded}
                onClick={() => {
                  addItem(product)
                  setIsAdded(true)
                  setTimeout(() => setIsAdded(false), 2000)
                }}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Saved to Collection
                  </span>
                ) : (
                  product.is_available ? 'Acquire Piece' : 'Currently Reserved'
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground italic">Pricing exclusive of regional heritage taxes and custom crating.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

