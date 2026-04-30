'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { useCart } from '@/providers/CartProvider'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Order } from '@/types'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const { items } = useCart()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Order[]
    },
    enabled: !!user?.id
  })

  if (loading) return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-secondary rounded-full animate-spin" />
    </div>
  )

  if (!user) return null

  const userEmail = user.email
  const userName = userEmail?.split('@')[0] || 'Curator'

  const curatedPieces = [
    { name: 'Onyx Desk Lamp', price: '$850', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=200' },
    { name: 'Silk Persian Rug', price: '$4,200', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=200' },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-20 pb-20">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl space-y-16">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-secondary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Member Portal</p>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif text-primary tracking-tighter leading-none capitalize">
              Welcome, <br /> {userName}.
            </h1>
            <p className="text-lg text-primary/40 font-medium max-w-xl">
              Your curated journey through architectural excellence continues here.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-primary/5 shadow-sm pr-6">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Heritage Tier</p>
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                Silver Curator <Star className="w-3 h-3 text-secondary fill-secondary" />
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content: Acquisitions */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                <h2 className="text-2xl font-serif text-primary">Acquisition Journal</h2>
                <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2 hover:gap-3 transition-all">
                  View All History <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {isLoadingOrders ? (
                  [1, 2].map(i => (
                    <div key={i} className="h-24 w-full bg-white border border-primary/5 animate-pulse" />
                  ))
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="group bg-white border border-primary/5 p-6 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-muted rounded-none overflow-hidden border border-primary/5 flex items-center justify-center">
                          {order.order_items?.[0]?.product?.images?.[0] ? (
                            <img src={order.order_items[0].product.images[0]} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-primary/20" />
                          )}
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30 mb-1">REF-{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-base font-serif text-primary group-hover:text-secondary transition-colors">
                            {order.order_items?.[0]?.product?.name || 'Bespoke Item'} 
                            {order.order_items && order.order_items.length > 1 && ` (+${order.order_items.length - 1} more)`}
                          </p>
                          <p className="text-[10px] text-primary/40 font-medium">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-1">Status</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                            order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-primary/5 text-primary/40'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-1">Investment</p>
                          <p className="text-sm font-serif text-primary">${order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-primary/10 p-12 text-center space-y-4">
                    <p className="text-sm font-serif italic text-primary/40">No past acquisitions found in the registry.</p>
                    <Link href="/shop">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/20 pb-0.5 hover:border-secondary transition-all">Begin Exploration</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Curated Pieces / Wishlist */}
            <div className="space-y-6 pt-10">
              <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                <h2 className="text-2xl font-serif text-primary">Curated Masterpieces</h2>
                <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2 hover:gap-3 transition-all">
                  Refine Collection <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {curatedPieces.map((piece) => (
                  <div key={piece.name} className="bg-white border border-primary/5 p-4 flex items-center gap-4 group hover:border-secondary/20 transition-colors">
                    <div className="w-20 h-20 bg-muted overflow-hidden">
                      <img src={piece.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-serif text-primary mb-1">{piece.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{piece.price}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-primary/20 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Profile & Security */}
          <div className="space-y-8">
            <div className="bg-white border border-primary/5 p-8 space-y-8 shadow-sm">
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/30 border-b border-primary/5 pb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <Link href="/dashboard/settings" className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary/30 group-hover:text-secondary transition-colors" />
                      <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">Personal Details</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-primary/30 group-hover:text-secondary transition-colors" />
                      <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">Security & Access</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-primary/30 group-hover:text-secondary transition-colors" />
                      <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">Preferences</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>

              <div className="pt-8 border-t border-primary/5">
                <SignOutButton />
              </div>
            </div>

            {/* Support / Concierge */}
            <div className="bg-primary p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="space-y-2 relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Private Access</p>
                <h3 className="text-2xl font-serif leading-tight">Bespoke Concierge</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed relative">
                As a Silver Curator, you have access to our direct design consultation line for your next architectural acquisition.
              </p>
              <Link href="/contact">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-none h-12 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 relative">
                  Request Consultation
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
