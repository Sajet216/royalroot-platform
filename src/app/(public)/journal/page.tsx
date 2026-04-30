'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { JournalEntry } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function JournalPage() {
  const supabase = createClient()

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal')
        .select('*')
        .order('published_at', { ascending: false })
      
      if (error) throw error
      return data as JournalEntry[]
    }
  })

  const featuredEntry = entries?.find(e => e.is_featured) || entries?.[0]
  const otherEntries = entries?.filter(e => e.id !== featuredEntry?.id) || []

  return (
    <div className="bg-background min-h-screen pt-20 pb-40">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="max-w-4xl space-y-8 mb-32">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-secondary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">The RoyalRoot Journal</p>
          </div>
          <h1 className="text-5xl lg:text-8xl font-serif text-primary tracking-tighter leading-none">Editorial <span className="italic">Perspectives.</span></h1>
          <p className="text-xl text-primary/60 font-medium max-w-xl leading-relaxed">
            A deeper exploration into the craftsmanship, philosophy, and architectural silence that defines our environment.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="aspect-[16/9] bg-muted animate-pulse" />
              <div className="space-y-6">
                <div className="h-4 w-20 bg-muted animate-pulse" />
                <div className="h-12 w-full bg-muted animate-pulse" />
                <div className="h-20 w-full bg-muted animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-8">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-muted animate-pulse" />
                    <div className="h-8 w-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : entries && entries.length > 0 ? (
          <>
            {/* Featured Entry */}
            {featuredEntry && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40 group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image 
                    src={featuredEntry.image || 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&q=80&w=1200'} 
                    alt={featuredEntry.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>
                <div className="space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Featured Perspective</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-primary group-hover:text-secondary transition-colors leading-tight">{featuredEntry.title}</h2>
                  <p className="text-lg text-primary/60 leading-relaxed font-medium line-clamp-3">{featuredEntry.excerpt}</p>
                  <Link href={`/journal/${featuredEntry.slug}`} className="inline-flex items-center gap-3 group/link">
                    <span className="text-primary font-bold uppercase tracking-widest text-[11px] border-b border-primary/10 pb-1 group-hover/link:border-primary transition-all">Read Narrative</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* Journal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {otherEntries.map((entry) => (
                <div key={entry.id} className="space-y-8 group cursor-pointer">
                  <Link href={`/journal/${entry.slug}`} className="block space-y-8">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image 
                        src={entry.image || 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800'} 
                        alt={entry.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{entry.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/20">
                          {new Date(entry.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif text-primary group-hover:text-secondary transition-colors leading-tight">{entry.title}</h3>
                      <p className="text-sm text-primary/60 font-medium leading-relaxed line-clamp-3">{entry.excerpt}</p>
                      <div className="inline-flex items-center gap-2 group/link">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover/link:text-secondary">Explore</span>
                        <ArrowRight className="w-3 h-3 text-primary group-hover/link:text-secondary group-hover/link:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-40 text-center border border-dashed border-primary/10 rounded-sm">
            <p className="font-serif italic text-primary/30 text-2xl">The journal archives are currently being restored.</p>
          </div>
        )}

        {/* Pagination Placeholder */}
        {entries && entries.length > 10 && (
          <div className="mt-40 border-t border-primary/5 pt-20 flex justify-center">
            <button className="flex flex-col items-center gap-4 group">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary transition-all group-hover:tracking-[0.6em]">Load Past Perspectives</span>
              <div className="w-12 h-px bg-primary/20 group-hover:w-24 transition-all duration-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
