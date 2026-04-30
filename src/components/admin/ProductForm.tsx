'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

export function ProductForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess: () => void,
  initialData?: Product
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('id, name').order('name')
      if (error) {
        // Fallback for UI if table doesn't exist
        return [{ id: '1', name: 'Seating' }, { id: '2', name: 'Tables' }]
      }
      return data
    }
  })
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price.toString() || '',
    dimensions: initialData?.dimensions || '',
    description: initialData?.description || '',
    is_available: initialData?.is_available ?? true,
    stock_quantity: initialData?.stock_quantity?.toString() || '1',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      let imageUrls = initialData?.images || []
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('furniture-images')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('furniture-images')
          .getPublicUrl(fileName)
          
        imageUrls = [publicUrl]
      }
      
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        dimensions: formData.dimensions,
        description: formData.description,
        is_available: formData.is_available,
        stock_quantity: parseInt(formData.stock_quantity),
        images: imageUrls
      }

      if (initialData?.id) {
        const { error: dbError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id)
        
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('products')
          .insert(productData)
        
        if (dbError) throw dbError
      }
      
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 text-primary">
      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Product Identity</label>
          <input 
            required 
            placeholder="e.g. Victorian Velvet Armchair"
            className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Collection Category</label>
          <select 
            required 
            className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none appearance-none"
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="" disabled className="bg-white">Select Designation</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.name} className="bg-white text-primary">{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Investment Value ($)</label>
          <input 
            type="number" 
            required 
            placeholder="2499"
            className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
            value={formData.price} 
            onChange={e => setFormData({...formData, price: e.target.value})} 
          />
        </div>
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Spatial Dimensions</label>
          <input 
            required 
            placeholder="e.g. 80 x 90 x 110 cm"
            className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
            value={formData.dimensions} 
            onChange={e => setFormData({...formData, dimensions: e.target.value})} 
          />
        </div>
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Units in Heritage Inventory</label>
          <input 
            type="number" 
            required 
            min="0"
            placeholder="1"
            className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
            value={formData.stock_quantity} 
            onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
          />
        </div>
      </div>
      
      <div className="space-y-2 group">
        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Narrative Description</label>
        <textarea 
          className="w-full min-h-[120px] bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none resize-none"
          required 
          placeholder="Crafted with artisanal precision..."
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="space-y-2 group">
        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">
          {initialData ? 'Update Visual Record (optional)' : 'Primary Visual Record'}
        </label>
        <input 
          type="file" 
          accept="image/*" 
          className="w-full text-xs text-primary/40 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary/5 file:text-primary hover:file:bg-primary/10 cursor-pointer transition-all"
          onChange={e => setImageFile(e.target.files?.[0] || null)} 
        />
      </div>
      
      <div className="flex items-center space-x-4 pt-4">
        <div className="relative inline-flex items-center">
          <input 
            type="checkbox" 
            id="is_available" 
            checked={formData.is_available && parseInt(formData.stock_quantity) > 0} 
            onChange={e => setFormData({...formData, is_available: e.target.checked})}
            className="peer h-4 w-4 cursor-pointer appearance-none border border-primary/20 transition-all checked:bg-secondary checked:border-secondary"
          />
          <svg
            className="pointer-events-none absolute h-4 w-4 stroke-white opacity-0 peer-checked:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <label htmlFor="is_available" className="text-[11px] font-bold uppercase tracking-widest text-primary/60 cursor-pointer">Available for Acquisition</label>
      </div>

      <div className="pt-10 flex justify-end">
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-serif text-lg transition-all duration-500 shadow-xl"
        >
          {loading ? 'Processing...' : initialData ? 'Commit Changes' : 'Register Masterpiece'}
        </Button>
      </div>
    </form>
  )
}

