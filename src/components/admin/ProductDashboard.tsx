'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProductForm } from './ProductForm'
import { Plus, Pencil, Trash2, Package, CheckCircle2, XCircle, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

export function ProductDashboard() {
  const supabase = createClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as Product[]
    }
  })

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the collection? This action cannot be undone.')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      refetch()
    } catch (error: any) {
      alert('Error deleting product: ' + error.message)
    }
  }

  const openCreateForm = () => {
    setEditingProduct(undefined)
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const stats = {
    total: products?.length || 0,
    totalUnits: products?.reduce((sum, p) => sum + p.stock_quantity, 0) || 0,
    inStock: products?.filter(p => p.is_available && p.stock_quantity > 0).length || 0,
    outOfStock: products?.filter(p => !p.is_available || p.stock_quantity === 0).length || 0
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Executive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-primary/5 p-4 rounded-full">
            <Package className="w-6 h-6 text-primary/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Unique Pieces</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-primary/5 p-4 rounded-full">
            <Package className="w-6 h-6 text-primary/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Total Units</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.totalUnits}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-secondary/5 p-4 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Active Collection</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.inStock}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-red-500/5 p-4 rounded-full">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Out of Stock</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-primary/5 rounded-none pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>
          
          <Button onClick={openCreateForm} className="bg-primary hover:bg-secondary text-white rounded-none h-12 px-8 font-bold uppercase tracking-widest text-[10px] transition-all duration-500 shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Button>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-primary/5 shadow-2xl rounded-none">
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl text-primary border-b border-primary/5 pb-6 text-center">
                  {editingProduct ? 'Update Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <div className="pt-6">
                <ProductForm 
                  key={editingProduct?.id || 'new'}
                  initialData={editingProduct}
                  onSuccess={() => { setIsFormOpen(false); refetch(); }} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-primary/5 rounded-none bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#fcfbf9]">
              <TableRow className="border-b border-primary/5 hover:bg-transparent">
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 pl-8">Product Name</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Category</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Price</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-center">Stock</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-center">Status</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32 text-primary/30 italic font-serif text-lg animate-pulse">Loading inventory...</TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32 text-primary/30 italic font-serif text-lg">No records match your inquiry.</TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(product => (
                  <TableRow key={product.id} className="border-b border-primary/5 hover:bg-[#faf9f6] transition-all duration-500">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-muted overflow-hidden border border-primary/5 relative group">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Package className="w-4 h-4 text-primary/10" />
                            </div>
                          )}
                          <div className="absolute inset-0 border border-black/5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-lg text-primary leading-none">{product.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">Ref: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary/60 text-[10px] font-bold uppercase tracking-widest">{product.category}</TableCell>
                    <TableCell className="font-serif text-primary text-base">${product.price.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{product.stock_quantity ?? 0}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-none border-0 ${
                          product.is_available && product.stock_quantity > 0 ? 'bg-secondary/5 text-secondary' : 'bg-red-500/5 text-red-400'
                        }`}
                      >
                        {product.is_available && product.stock_quantity > 0 ? 'In Stock' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-6 pr-8">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditForm(product)}
                          className="w-10 h-10 text-primary/30 hover:text-secondary hover:bg-secondary/5 rounded-none transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(product.id)}
                          className="w-10 h-10 text-primary/20 hover:text-red-400 hover:bg-red-500/5 rounded-none transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

