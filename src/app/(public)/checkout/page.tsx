'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/providers/CartProvider'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Truck, CreditCard, ArrowRight, Package, Check } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const supabase = createClient()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/checkout')
      } else {
        setUser(session.user)
        setFormData(prev => ({ ...prev, email: session.user.email || '' }))
      }
    }
    checkUser()
  }, [router, supabase])

  if (!user && !loading) {
    return (
      <div className="container mx-auto px-6 py-40 text-center space-y-10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-serif text-primary tracking-tight">Identity Verification Required.</h1>
          <p className="text-primary/60 leading-relaxed font-medium">
            To provide our signature white-glove service and track your order history, please sign in to your RoyalRoot account.
          </p>
          <div className="pt-8 flex flex-col gap-4">
            <Link href={`/login?redirect=/checkout`}>
              <Button className="w-full h-14 bg-primary hover:bg-secondary text-white rounded-none font-bold uppercase tracking-widest text-[11px] transition-all">
                Sign In to Continue
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="w-full h-14 rounded-none font-bold uppercase tracking-widest text-[11px] border-primary/10">
                Create Member Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-6 py-40 text-center space-y-8">
        <h1 className="text-4xl font-serif text-primary">Your shop is empty.</h1>
        <p className="text-primary/40 font-medium italic">Begin by selecting a masterpiece from our collection.</p>
        <Link href="/shop">
          <Button className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-bold uppercase tracking-widest text-[11px]">Explore Collection</Button>
        </Link>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          shipping_address: formData,
          contact_email: formData.email,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Clear cart and redirect
      clearCart()
      router.push('/checkout/success')
    } catch (error: any) {
      alert('Error processing order: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-40">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-secondary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Final Step</p>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif text-primary tracking-tighter leading-none">Checkout.</h1>
            </div>

            <form onSubmit={handleCheckout} className="space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">First Name</label>
                    <input name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Last Name</label>
                    <input name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary" />
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-4">Shipping Address</h3>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Street Address</label>
                    <input name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">City</label>
                      <input name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Postal Code</label>
                      <input name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-all font-serif text-lg text-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Country</label>
                      <input name="country" required value={formData.country} onChange={handleInputChange} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-4">Payment Method</h3>
                <div className="bg-white border border-primary/5 p-8 flex items-center justify-between group cursor-not-allowed grayscale opacity-60">
                  <div className="flex items-center gap-6">
                    <CreditCard className="w-6 h-6 text-primary/20" />
                    <div>
                      <p className="text-sm font-serif text-primary">Bank Transfer / Card Payment</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Secured with RSA Encryption</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-[10px] text-primary/30 italic">Payment is securely processed after the order is confirmed.</p>
              </section>

              <Button type="submit" disabled={loading} className="w-full h-20 bg-primary hover:bg-secondary text-white rounded-none font-bold uppercase tracking-[0.3em] text-[12px] transition-all duration-500 shadow-2xl relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? 'Processing...' : 'Complete Order'} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
            <div className="bg-white border border-primary/5 p-10 space-y-10 shadow-sm">
              <h2 className="text-2xl font-serif text-primary border-b border-primary/5 pb-6">Order Summary</h2>
              
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted relative flex-shrink-0">
                        {item.images[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover grayscale" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-serif text-primary">{item.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-primary/5">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/40 font-medium">Subtotal</span>
                  <span className="font-serif text-primary">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/40 font-medium">Shipping</span>
                  <span className="font-serif text-primary text-secondary uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="flex justify-between text-xl pt-6 border-t border-primary/5">
                  <span className="font-serif text-primary">Order Total</span>
                  <span className="font-serif text-secondary">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#faf9f6] p-6 space-y-4">
                <div className="flex items-center gap-3 text-secondary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Authenticity Guaranteed</span>
                </div>
                <p className="text-[10px] text-primary/40 leading-relaxed font-medium">
                  Every piece in your order is verified by our heritage experts and includes a certificate of authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-primary/20 justify-center">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption Enabled</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
