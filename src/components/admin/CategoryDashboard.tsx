'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Layers, Search, Package } from 'lucide-react'
import { useState, useMemo } from 'react'

type Category = {
  id: string
  created_at: string
  name: string
  description: string
  image_url: string
}

export function CategoryDashboard() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        // Fallback: If table doesn't exist, try to derive from products
        const { data: products, error: pError } = await supabase.from('products').select('category')
        if (pError) throw pError
        const uniqueCats = Array.from(new Set(products.map(p => p.category)))
        return uniqueCats.map((name, i) => ({
          id: i.toString(),
          name,
          description: 'Derived from active inventory.',
          created_at: new Date().toISOString(),
          image_url: ''
        })) as Category[]
      }
      return data as Category[]
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    }
  })

  const filteredCategories = useMemo(() => {
    if (!categories) return []
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleOpenForm = (cat: Category | null = null) => {
    setEditingCategory(cat)
    setFormData({ 
      name: cat?.name || '', 
      description: cat?.description || '' 
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        const { error } = await supabase.from('categories').update(formData).eq('id', editingCategory.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('categories').insert(formData)
        if (error) throw error
      }
      setIsFormOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    } catch (error: any) {
      alert('Error saving category: ' + error.message)
    }
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-primary/5 rounded-none pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
          />
        </div>

        <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-secondary text-white rounded-none h-12 px-8 font-bold uppercase tracking-widest text-[10px] transition-all duration-500 shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Define New Category
        </Button>
      </div>

      <div className="border border-primary/5 rounded-none bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#fcfbf9]">
            <TableRow className="border-b border-primary/5 hover:bg-transparent">
              <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 pl-8">Category Name</TableHead>
              <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Description</TableHead>
              <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-right pr-8">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-32 text-primary/30 italic font-serif text-lg animate-pulse">Organizing taxonomies...</TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-32 text-primary/30 italic font-serif text-lg">No categories defined.</TableCell>
              </TableRow>
            ) : (
              filteredCategories.map(cat => (
                <TableRow key={cat.id} className="border-b border-primary/5 hover:bg-[#faf9f6] transition-all duration-500">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/5 rounded-sm">
                        <Layers className="w-4 h-4 text-primary/40" />
                      </div>
                      <p className="font-serif text-lg text-primary leading-none">{cat.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-primary/60 text-sm max-w-md truncate">{cat.description}</TableCell>
                  <TableCell className="text-right py-6 pr-8">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenForm(cat)}
                        className="w-10 h-10 text-primary/30 hover:text-secondary hover:bg-secondary/5 rounded-none transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteMutation.mutate(cat.id)}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl border-primary/5 shadow-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl text-primary border-b border-primary/5 pb-6 text-center">
              {editingCategory ? 'Refine Category' : 'Define Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="pt-8 space-y-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Category Designation</label>
              <input 
                required 
                placeholder="e.g. Architectural Lighting"
                className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Taxonomic Narrative</label>
              <textarea 
                className="w-full min-h-[100px] bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none resize-none"
                placeholder="Describe the aesthetic essence of this category..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="pt-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-serif text-lg transition-all duration-500 shadow-xl">
                {editingCategory ? 'Commit Changes' : 'Register Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
