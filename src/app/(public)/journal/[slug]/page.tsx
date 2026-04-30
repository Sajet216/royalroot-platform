'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { JournalEntry } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag } from 'lucide-react'

export default function JournalDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const { data: entry, isLoading } = useQuery({
    queryKey: ['journal-entry', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data as JournalEntry
    },
    enabled: !!slug
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-40 pb-40">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div className="h-4 w-32 bg-muted animate-pulse" />
          <div className="h-20 w-full bg-muted animate-pulse" />
          <div className="aspect-[21/9] bg-muted animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse" />
            <div className="h-4 w-full bg-muted animate-pulse" />
            <div className="h-4 w-2/3 bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-serif text-primary">Narrative Not Found</h2>
          <p className="text-primary/60">The story you are looking for has been archived or removed.</p>
          <Link href="/journal">
            <button className="bg-primary text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all">
              Return to Journal
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pt-40 pb-60">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 hover:text-secondary transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Archive
        </button>

        {/* Article Header */}
        <div className="space-y-10 mb-20">
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 text-secondary">
              <Tag className="w-3 h-3" />
              {entry.category}
            </div>
            <div className="flex items-center gap-2 text-primary/30">
              <Clock className="w-3 h-3" />
              {new Date(entry.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-tighter leading-[0.95]">
            {entry.title}
          </h1>

          <p className="text-xl md:text-2xl text-primary/60 font-medium leading-relaxed italic border-l-2 border-secondary/20 pl-8">
            {entry.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        {entry.image && (
          <div className="relative aspect-[21/9] mb-20 overflow-hidden">
            <Image 
              src={entry.image} 
              alt={entry.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-serif">
          <div className="text-lg text-primary/80 leading-[1.8] space-y-8 whitespace-pre-wrap font-medium">
            {entry.content}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-40 pt-20 border-t border-primary/5 text-center space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Deepen your perspective</p>
            <h2 className="text-4xl font-serif text-primary">Explore our collection.</h2>
          </div>
          <Link href="/shop">
            <button className="bg-primary text-white px-12 py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-2xl">
              View Registry
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
