'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { JournalEntry } from '@/types'

export function JournalForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess: () => void,
  initialData?: JournalEntry
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    is_featured: initialData?.is_featured ?? false,
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      let imageUrl = initialData?.image || ''
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `journal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('furniture-images')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('furniture-images')
          .getPublicUrl(fileName)
          
        imageUrl = publicUrl
      }
      
      const journalData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        is_featured: formData.is_featured,
        image: imageUrl
      }

      if (initialData?.id) {
        const { error: dbError } = await supabase
          .from('journal')
          .update(journalData)
          .eq('id', initialData.id)
        
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('journal')
          .insert(journalData)
        
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
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Narrative Title</label>
            <input 
              required 
              placeholder="e.g. The Silent Dialogue of Oak"
              className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">URL Slug</label>
            <input 
              required 
              placeholder="the-silent-dialogue-of-oak"
              className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Category</label>
            <input 
              required 
              placeholder="e.g. Craftsmanship"
              className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Visual Record</label>
            <input 
              type="file" 
              accept="image/*" 
              className="w-full text-xs text-primary/40 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary/5 file:text-primary hover:file:bg-primary/10 cursor-pointer transition-all"
              onChange={e => setImageFile(e.target.files?.[0] || null)} 
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Brief Excerpt</label>
          <textarea 
            className="w-full min-h-[80px] bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none resize-none"
            required 
            placeholder="A short summary for the gallery view..."
            value={formData.excerpt} 
            onChange={e => setFormData({...formData, excerpt: e.target.value})}
          />
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 group-focus-within:text-secondary transition-colors">Full Narrative Content</label>
          <textarea 
            className="w-full min-h-[300px] bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm focus:ring-0 focus:border-secondary transition-all outline-none resize-none"
            required 
            placeholder="Write your story here..."
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              id="is_featured" 
              checked={formData.is_featured} 
              onChange={e => setFormData({...formData, is_featured: e.target.checked})}
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
          <label htmlFor="is_featured" className="text-[11px] font-bold uppercase tracking-widest text-primary/60 cursor-pointer">Feature this Narrative</label>
        </div>
      </div>

      <div className="pt-10 flex justify-end">
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-serif text-lg transition-all duration-500 shadow-xl"
        >
          {loading ? 'Archiving...' : initialData ? 'Update Story' : 'Publish Story'}
        </Button>
      </div>
    </form>
  )
}
