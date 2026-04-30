'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Order, OrderItem } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, Search, ChevronRight, Clock, Truck, CheckCircle2, XCircle, Mail, MapPin } from 'lucide-react'
import { useState, useMemo } from 'react'

export function OrderDashboard() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(*))')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as (Order & { order_items: (OrderItem & { product: any })[] })[]
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      // 1. Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
      
      if (orderError) throw orderError

      // 2. If cancelled, return items to stock
      if (status === 'cancelled' && selectedOrder?.order_items) {
        const productIds = selectedOrder.order_items.map(item => item.product_id)
        const { error: productError } = await supabase
          .from('products')
          .update({ is_available: true })
          .in('id', productIds)
        
        if (productError) console.error('Failed to return items to stock', productError)
      }
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }) // Sync inventory counts
      if (selectedOrder) {
        setSelectedOrder(prev => prev ? { ...prev, status: variables.status } : null)
      }

      // Trigger Shipping Notification if applicable
      if (variables.status === 'shipped' || variables.status === 'delivered') {
        try {
          const { sendEmail, emailTemplates } = await import('@/lib/email')
          const email = selectedOrder?.contact_email || ''
          if (email) {
            const template = emailTemplates.shippingUpdate(variables.id, variables.status)
            await sendEmail({ to: email, ...template })
          }
        } catch (e) {
          console.error('Failed to send status update email', e)
        }
      }
    }
  })

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    return orders.filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.contact_email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    shipped: orders?.filter(o => o.status === 'shipped').length || 0,
    revenue: orders?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/5 text-amber-500'
      case 'processing': return 'bg-blue-500/5 text-blue-500'
      case 'shipped': return 'bg-indigo-500/5 text-indigo-500'
      case 'delivered': return 'bg-secondary/5 text-secondary'
      case 'cancelled': return 'bg-red-500/5 text-red-500'
      default: return 'bg-primary/5 text-primary/40'
    }
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Gross Revenue</p>
          <p className="text-3xl font-serif text-primary leading-none mt-2">${stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-amber-500/5 p-4 rounded-full">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Pending</p>
            <p className="text-2xl font-serif text-primary mt-1">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-indigo-500/5 p-4 rounded-full">
            <Truck className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">In Transit</p>
            <p className="text-2xl font-serif text-primary mt-1">{stats.shipped}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-secondary/5 p-4 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Fulfilled</p>
            <p className="text-2xl font-serif text-primary mt-1">{orders?.filter(o => o.status === 'delivered').length || 0}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search acquisitions by ID or email..." 
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
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 pl-8">Order ID</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Customer</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Total Amount</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-center">Order Status</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg animate-pulse">Syncing with global registry...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg">No acquisitions found in record.</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="border-b border-primary/5 hover:bg-[#faf9f6] transition-all duration-500">
                    <TableCell className="py-6 pl-8">
                      <div className="space-y-1">
                        <p className="font-serif text-base text-primary leading-none">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary/60 text-sm font-medium">{order.contact_email}</TableCell>
                    <TableCell className="font-serif text-primary text-base">${order.total_amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-none border-0 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-6 pr-8">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedOrder(order)}
                        className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-secondary/5 rounded-none"
                      >
                        View Details <ChevronRight className="w-3 h-3 ml-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-primary/5 shadow-2xl rounded-none p-0">
          {selectedOrder && (
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side: Order Details */}
              <div className="flex-1 p-12 space-y-12 bg-[#faf9f6]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-secondary" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Order Details</p>
                  </div>
                  <h2 className="text-4xl font-serif text-primary tracking-tighter leading-none">Order Summary.</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">Order ID: {selectedOrder.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Customer Email
                    </h3>
                    <p className="text-sm font-medium text-primary">{selectedOrder.contact_email}</p>
                    <p className="text-[10px] text-primary/30 leading-relaxed">
                      All communication regarding this acquisition is funneled through this encrypted channel.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-2 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Delivery Destination
                    </h3>
                    <div className="text-sm font-medium text-primary space-y-1">
                      <p>{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                      <p>{selectedOrder.shipping_address.address}</p>
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-2">Manifest</h3>
                  <div className="space-y-6">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border border-primary/5 overflow-hidden">
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt="" className="w-full h-full object-cover grayscale" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary/10" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-serif text-primary">{item.product?.name || 'Unknown Masterpiece'}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-primary">${(item.unit_price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-primary/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Total Settlement</p>
                    <p className="text-3xl font-serif text-secondary">${selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Protocol Management */}
              <div className="w-full lg:w-80 bg-white border-l border-primary/5 p-12 space-y-12">
                <div className="space-y-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 border-b border-primary/5 pb-2">Update Status</h3>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Set Current Status</p>
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status })}
                        disabled={updateStatusMutation.isPending}
                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedOrder.status === status 
                            ? getStatusColor(status) + ' border border-current'
                            : 'text-primary/40 hover:bg-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-12 border-t border-primary/5">
                  <p className="text-[9px] text-primary/30 italic leading-relaxed">
                    Updating the protocol status triggers automated white-glove logistics updates and collector notifications.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-none border-primary/10 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all"
                  >
                    Archive Record
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
