'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5)

      if (!error && data) {
        setResults(data)
        setIsOpen(true)
      }
      setLoading(false)
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query, supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/shop?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-md group" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-secondary transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search collections..."
          className="w-full bg-primary/5 border border-transparent focus:border-secondary/20 focus:bg-white rounded-none pl-12 pr-10 py-2.5 text-sm font-medium text-primary placeholder:text-primary/20 transition-all outline-none"
        />
        {query && (
          <button 
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/5 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary/5 border-t-secondary rounded-full animate-spin mx-auto" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30 px-4 py-2">Suggested Acquisitions</p>
              <div className="space-y-1">
                {results.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-[#faf9f6] transition-colors group/item"
                  >
                    <div className="w-12 h-12 bg-muted relative flex-shrink-0">
                      {product.images[0] && (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif text-primary truncate">{product.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">${product.price.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-primary/0 group-hover/item:text-secondary group-hover/item:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
              <button 
                onClick={handleSearch}
                className="w-full mt-2 p-3 text-[10px] font-bold uppercase tracking-widest text-center text-secondary bg-[#faf9f6] hover:bg-secondary hover:text-white transition-all"
              >
                View all results for "{query}"
              </button>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-serif italic text-primary/40">No matches found in the registry.</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">Try broadening your search criteria</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
