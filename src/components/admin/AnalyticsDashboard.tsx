'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Order, OrderItem, Product } from '@/types'
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, Target, Zap, Globe } from 'lucide-react'
import { useMemo } from 'react'

export function AnalyticsDashboard() {
  const supabase = createClient()

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*, order_items(*, product:products(*))').order('created_at', { ascending: true }),
        supabase.from('products').select('*')
      ])

      if (ordersRes.error) throw ordersRes.error
      if (productsRes.error) throw productsRes.error

      return {
        orders: ordersRes.data as (Order & { order_items: (OrderItem & { product: Product })[] })[],
        products: productsRes.data as Product[]
      }
    }
  })

  const metrics = useMemo(() => {
    if (!analyticsData) return null

    const orders = analyticsData.orders
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Revenue by Category
    const categoryRevenue: Record<string, number> = {}
    orders.forEach(order => {
      order.order_items?.forEach(item => {
        const cat = item.product?.category || 'Uncategorized'
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (Number(item.unit_price) * item.quantity)
      })
    })

    // Top Products
    const productSales: Record<string, { name: string, amount: number, qty: number }> = {}
    orders.forEach(order => {
      order.order_items?.forEach(item => {
        if (!item.product) return
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { name: item.product.name, amount: 0, qty: 0 }
        }
        productSales[item.product_id].amount += (Number(item.unit_price) * item.quantity)
        productSales[item.product_id].qty += item.quantity
      })
    })

    const topProducts = Object.values(productSales).sort((a, b) => b.amount - a.amount).slice(0, 5)

    // Daily Revenue (Last 7 days)
    const dailyRev: Record<string, number> = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      dailyRev[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0
    }

    orders.forEach(order => {
      const date = new Date(order.created_at)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' })
      if (dailyRev[day] !== undefined) {
        dailyRev[day] += Number(order.total_amount)
      }
    })

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      categoryRevenue,
      topProducts,
      dailyRev: Object.entries(dailyRev)
    }
  }, [analyticsData])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-white border border-primary/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const maxDaily = Math.max(...metrics.dailyRev.map(([_, val]) => val)) || 1

  return (
    <div className="space-y-16 pb-20">
      {/* High-Level Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-secondary/5 rounded-full">
              <DollarSign className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex items-center text-secondary text-[10px] font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Gross Settlement</p>
            <p className="text-3xl font-serif text-primary mt-1">${metrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-500/5 rounded-full">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-center text-blue-500 text-[10px] font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 8%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Acquisition Volume</p>
            <p className="text-3xl font-serif text-primary mt-1">{metrics.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-500/5 rounded-full">
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-center text-primary/20 text-[10px] font-bold">
              Stable
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Average Investment</p>
            <p className="text-3xl font-serif text-primary mt-1">${Math.round(metrics.avgOrderValue).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-500/5 rounded-full">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center text-red-400 text-[10px] font-bold">
              <ArrowDownRight className="w-3 h-3 mr-1" /> 3%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Conversion Flow</p>
            <p className="text-3xl font-serif text-primary mt-1">4.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Weekly Revenue Pulse */}
        <div className="bg-white border border-primary/5 p-12 space-y-12 shadow-sm">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="text-xl font-serif text-primary">Revenue Pulse</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 text-nowrap">Last 7 cycles of operation</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-serif text-secondary">${metrics.dailyRev.reduce((s, [_, v]) => s + v, 0).toLocaleString()}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">Weekly Aggregate</p>
            </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-4 pt-8">
            {metrics.dailyRev.map(([day, val]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full flex flex-col justify-end h-full">
                  <div 
                    className="w-full bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-700 relative"
                    style={{ height: `${(val / maxDaily) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-bold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      ${Math.round(val/1000)}k
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="bg-white border border-primary/5 p-12 space-y-10 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-serif text-primary">Portfolio Distribution</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Revenue allocation by category</p>
          </div>

          <div className="space-y-8">
            {Object.entries(metrics.categoryRevenue).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
              <div key={cat} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary/60">{cat}</span>
                  <span className="text-[11px] font-serif text-primary">${val.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-primary/5 overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-1000 ease-out"
                    style={{ width: `${(val / metrics.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Acquisitions */}
      <div className="bg-white border border-primary/5 p-12 space-y-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-secondary" />
          <h3 className="text-2xl font-serif text-primary">Top Performing Acquisitions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {metrics.topProducts.map((product, i) => (
            <div key={product.name} className="space-y-6 group">
              <div className="aspect-[4/5] bg-primary/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl font-serif text-primary/5 group-hover:text-primary/10 transition-colors">{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary/20 group-hover:h-full transition-all duration-700 opacity-0 group-hover:opacity-10" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm font-serif text-primary line-clamp-1">{product.name}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-primary/20">Volume</p>
                    <p className="text-xs font-bold text-primary">{product.qty}</p>
                  </div>
                  <div className="w-px h-4 bg-primary/10" />
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-primary/20">Yield</p>
                    <p className="text-xs font-bold text-secondary">${product.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
