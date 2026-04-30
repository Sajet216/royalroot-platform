'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search as SearchIcon, ArrowRight, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5)

      if (!error && data) {
        setResults(data as Product[])
      }
      setIsLoading(false)
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query, supabase])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="container mx-auto px-6 h-full flex flex-col">
        <div className="flex justify-between items-center h-24 border-b border-primary/5">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Global Registry Search</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/5 rounded-full w-12 h-12">
            <X className="w-6 h-6 text-primary" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col pt-20 lg:pt-32 max-w-4xl mx-auto w-full space-y-12">
          <div className="relative group">
            <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/20 group-focus-within:text-secondary transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Inquire for masterpieces..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-4xl md:text-6xl font-serif text-primary placeholder:text-primary/10 focus:outline-none pl-14 md:pl-20 pb-4 border-b-2 border-primary/5 focus:border-secondary transition-all"
            />
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-primary/5 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 border-b border-primary/5 pb-4">Discovered Acquisitions ({results.length})</p>
                {results.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="group flex items-center justify-between p-4 bg-white border border-primary/5 hover:border-secondary/20 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-muted overflow-hidden relative">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Package className="w-6 h-6 text-primary/10" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{product.category}</p>
                        <h3 className="text-xl font-serif text-primary group-hover:text-secondary transition-colors">{product.name}</h3>
                        <p className="text-sm text-primary/40 font-medium">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary/10 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
                  </Link>
                ))}
              </div>
            ) : query.trim().length > 1 ? (
              <div className="text-center py-20 border border-dashed border-primary/10 rounded-sm">
                <p className="font-serif italic text-primary/40 text-2xl">No records match your inquiry.</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20 mt-4">Try searching for "Living", "Table", or "Oak"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/40">Suggested Collections</h4>
                  <div className="flex flex-wrap gap-3">
                    {['Architectural', 'Minimalist', 'Heritage', 'Bespoke'].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setQuery(tag)}
                        className="px-6 py-2 border border-primary/5 text-[10px] font-bold uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/40">Popular Acquisitions</h4>
                  <div className="space-y-4">
                    {['Solid Oak Dining Table', 'Velvet Accent Chair', 'Onyx Desk Lamp'].map(item => (
                      <button 
                        key={item}
                        onClick={() => setQuery(item)}
                        className="block w-full text-left font-serif text-lg text-primary/60 hover:text-secondary transition-colors border-b border-primary/5 pb-2"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
