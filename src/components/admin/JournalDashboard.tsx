'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { JournalEntry } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { JournalForm } from './JournalForm'
import { Plus, Pencil, Trash2, BookOpen, Star, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

export function JournalDashboard() {
  const supabase = createClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: entries, isLoading, refetch } = useQuery({
    queryKey: ['admin-journal'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal')
        .select('*')
        .order('published_at', { ascending: false })
      if (error) throw error
      return data as JournalEntry[]
    }
  })

  const filteredEntries = useMemo(() => {
    if (!entries) return []
    return entries.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [entries, searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this narrative from the journal? This action cannot be undone.')) return

    try {
      const { error } = await supabase.from('journal').delete().eq('id', id)
      if (error) throw error
      refetch()
    } catch (error: any) {
      alert('Error deleting entry: ' + error.message)
    }
  }

  const openCreateForm = () => {
    setEditingEntry(undefined)
    setIsFormOpen(true)
  }

  const openEditForm = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setIsFormOpen(true)
  }

  const stats = {
    total: entries?.length || 0,
    featured: entries?.filter(e => e.is_featured).length || 0
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-primary/5 p-4 rounded-full">
            <BookOpen className="w-6 h-6 text-primary/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Total Narratives</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-primary/5 p-8 rounded-sm shadow-sm flex items-center space-x-6">
          <div className="bg-secondary/5 p-4 rounded-full">
            <Star className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Featured Perspectives</p>
            <p className="text-3xl font-serif text-primary leading-none mt-1">{stats.featured}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search narratives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-primary/5 rounded-none pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>
          
          <button 
            onClick={openCreateForm} 
            className="bg-primary hover:bg-secondary text-white h-12 px-8 font-bold uppercase tracking-widest text-[10px] transition-all duration-500 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2 inline" /> New Journal Entry
          </button>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-primary/5 shadow-2xl rounded-none">
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl text-primary border-b border-primary/5 pb-6 text-center">
                  {editingEntry ? 'Refine Narrative' : 'Compose New Narrative'}
                </DialogTitle>
              </DialogHeader>
              <div className="pt-6">
                <JournalForm 
                  initialData={editingEntry}
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
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 pl-8">Narrative</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Category</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14">Published</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-center">Featured</TableHead>
                <TableHead className="font-bold text-primary/40 uppercase text-[9px] tracking-[0.3em] h-14 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg animate-pulse">Consulting the archives...</TableCell>
                </TableRow>
              ) : filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32 text-primary/30 italic font-serif text-lg">The journal is silent.</TableCell>
                </TableRow>
              ) : (
                filteredEntries.map(entry => (
                  <TableRow key={entry.id} className="border-b border-primary/5 hover:bg-[#faf9f6] transition-all duration-500">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-12 bg-muted overflow-hidden border border-primary/5 relative group">
                          {entry.image ? (
                            <img src={entry.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <BookOpen className="w-4 h-4 text-primary/10" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-lg text-primary leading-none">{entry.title}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">{entry.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary/60 text-[10px] font-bold uppercase tracking-widest">{entry.category}</TableCell>
                    <TableCell className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(entry.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.is_featured && (
                        <Badge variant="outline" className="bg-secondary/5 text-secondary border-0 font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-none">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-6 pr-8">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditForm(entry)}
                          className="w-10 h-10 text-primary/30 hover:text-secondary hover:bg-secondary/5 rounded-none transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(entry.id)}
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
