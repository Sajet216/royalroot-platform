'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, User, Mail, Calendar, CreditCard, ChevronRight, Star } from 'lucide-react'
import { useState, useMemo } from 'react'

type CustomerStat = {
  user_id: string
  email: string
  name: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export function CustomerDashboard() {
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      const orders = data as Order[]
      
      // Group by user_id
      const customerMap = new Map<string, CustomerStat>()
      
      orders.forEach(order => {
        const existing = customerMap.get(order.user_id)
        if (existing) {
          existing.totalOrders += 1
          existing.totalSpent += Number(order.total_amount)
        } else {
          customerMap.set(order.user_id, {
            user_id: order.user_id,
            email: order.contact_email,
            name: `${order.shipping_address.firstName} ${order.shipping_address.lastName}`,
            totalOrders: 1,
            totalSpent: Number(order.total_amount),
            lastOrderDate: order.created_at
          })
        }
      })
      
      return Array.from(customerMap.values())
    }
  })

  const filteredCustomers = useMemo(() => {
    if (!customers) return []
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [customers, searchQuery])

  const stats = {
    total: customers?.length || 0,
    vip: customers?.filter(c => c.totalSpent > 5000).length || 0,
    newThisMonth: customers?.filter(c => {
      const date = new Date(c.lastOrderDate)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length || 0
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Collector Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-primary/5 p-4 rounded-full">
            <User className="w-5 h-5 text-primary/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Total Collectors</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-secondary/5 p-4 rounded-full">
            <Star className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">VIP Patrons</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.vip}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-blue-500/5 p-4 rounded-full">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Active This Moon</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.newThisMonth}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search collectors by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-primary/5 rounded-none pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>
        </div>

        <div className="border border-primary/5 rounded-none bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#fcfbf9]">
              <TableRow className="border-b border-primary/5 hover:bg-transparent">
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 pl-8">Collector Identity</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Acquisitions</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Lifetime Value</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Last Interaction</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-right pr-8">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg animate-pulse">Consulting the peerage...</TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg">No collectors found in registry.</TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map(customer => (
                  <TableRow key={customer.user_id} className="border-b border-primary/5 hover:bg-[#faf9f6] transition-all duration-500">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 font-serif text-lg">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-serif text-base text-primary leading-none">{customer.name}</p>
                            {customer.totalSpent > 5000 && (
                              <Badge className="bg-secondary/10 text-secondary border-0 text-[8px] uppercase tracking-tighter px-1.5 py-0">Patron</Badge>
                            )}
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary/60 text-sm font-medium">{customer.totalOrders} items</TableCell>
                    <TableCell className="font-serif text-primary text-base">${customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right py-6 pr-8">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-secondary/5 rounded-none"
                      >
                        Profile Archive <ChevronRight className="w-3 h-3 ml-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
