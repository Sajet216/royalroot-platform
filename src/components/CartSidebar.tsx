'use client'

import { useCart } from '@/providers/CartProvider'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[480px] bg-[#faf9f6] z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-700 ease-in-out">
        
        {/* Header */}
        <div className="p-8 border-b border-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-serif text-primary tracking-tight">Your Collection</h2>
            <span className="text-[10px] font-bold bg-primary/5 px-2 py-1 rounded-full text-primary/40 uppercase tracking-widest">{totalItems} Products</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/5">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
              <ShoppingBag className="w-12 h-12 stroke-[1px]" />
              <p className="text-sm font-serif italic">Your shop is currently empty.</p>
              <Button variant="outline" onClick={onClose} className="rounded-none uppercase text-[10px] tracking-widest font-bold">Begin Selection</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-32 bg-muted relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.images[0]} 
                    alt={item.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-serif text-primary group-hover:text-secondary transition-colors leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-primary/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40 mt-1">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-primary/5 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-secondary transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-[10px] font-bold text-primary">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-serif text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-primary/5 space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-serif text-primary">
                <span>Order Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-none text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl group">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
