'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/types'

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, delta: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('royalroot_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('royalroot_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        // Validation: Don't exceed stock
        if (existing.quantity >= product.stock_quantity) {
          alert(`The collection only has ${product.stock_quantity} units of this masterpiece.`)
          return prev
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(0, item.quantity + delta)
          // Validation: Don't exceed stock
          if (newQty > item.stock_quantity) {
            alert(`The collection only has ${item.stock_quantity} units of this masterpiece.`)
            return item
          }
          return { ...item, quantity: newQty }
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
