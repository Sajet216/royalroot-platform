'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '@/providers/CartProvider'
import { CartSidebar } from './CartSidebar'
import { SearchBar } from './SearchBar'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/" className="flex flex-col group flex-shrink-0">
            <span className="font-serif text-2xl tracking-tight text-primary transition-colors">RoyalRoot</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-secondary -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">Interiors</span>
          </Link>
          
          <div className="hidden lg:flex gap-8">
            <Link href="/shop" className="text-[11px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-all duration-300">Collections</Link>
            {['Living Room', 'Bedroom', 'Office'].map((item) => (
              <Link 
                key={item}
                href={`/category/${item.toLowerCase().replace(' room', '')}`} 
                className="text-[11px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-all duration-300"
              >
                {item}
              </Link>
            ))}
            <Link href="/journal" className="text-[11px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-all duration-300">Journal</Link>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-primary/60 hover:text-primary transition-colors">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          
          {/* Cart Trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary/60 hover:text-primary transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white animate-in zoom-in duration-300" />
            )}
          </Button>
          
          <div className="h-6 w-px bg-primary/10 mx-2 hidden md:block" />
          
          {/* Executive Link - Refined for User Side */}
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-secondary h-9 px-4 transition-all">
              Customer Dashboard
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-20">
          <div className="absolute inset-0 bg-background/98 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative z-50 p-8 space-y-8 animate-in slide-in-from-right duration-500 flex flex-col h-full bg-background border-l border-primary/5 ml-auto w-full max-w-sm">
            
            <div className="mb-8">
              <SearchBar />
            </div>

            <div className="flex flex-col space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary mb-4">Shop Navigation</p>
              <Link href="/shop" className="text-3xl font-serif text-primary hover:text-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
              {['Living Room', 'Bedroom', 'Office'].map((item) => (
                <Link 
                  key={item}
                  href={`/category/${item.toLowerCase().replace(' room', '')}`} 
                  className="text-3xl font-serif text-primary hover:text-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link href="/journal" className="text-3xl font-serif text-primary hover:text-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
              
              <div className="pt-12 flex flex-col gap-4">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-white font-bold uppercase tracking-widest text-[11px] h-14 rounded-none shadow-xl">
                    Customer Dashboard
                  </Button>
                </Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-primary/10 text-primary/60 font-bold uppercase tracking-widest text-[11px] h-14 rounded-none">
                    All Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-auto pt-20 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">RoyalRoot Interiors © 2025</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

