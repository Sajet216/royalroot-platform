'use client'

import Image from 'next/image'
import { ArrowRight, MoveDown } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            alt="Interior Craftsmanship" 
            fill 
            className="object-cover brightness-[0.7] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/60 block">Our Heritage</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none">
            Architectural <span className="italic opacity-90">Silence.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto font-medium">
            We believe that a space should not just be filled, but curated to reflect the weight of history and the beauty of the present.
          </p>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-32 md:py-60">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">The Manifesto</span>
                <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight">
                  Furniture as <br /> <span className="italic text-secondary">Aura.</span>
                </h2>
              </div>
              <div className="space-y-8 text-lg text-primary/60 leading-relaxed font-medium">
                <p>
                  RoyalRoot Interiors was born from a singular obsession: the tactile relationship between human and wood. We reject the industrial noise of modern production in favor of a slower, more intentional dialogue with materials.
                </p>
                <p>
                  Every piece in our registry is hand-selected and verified for its "Architectural Silence"—the quality of a piece to command a room without making a sound. From solid oak salvaged from heritage estates to brass hand-forged in small-batch foundries, materiality is our primary language.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=1200" 
                  alt="Workshop" 
                  fill 
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 hidden md:block w-64 h-64 border-[1px] border-secondary/20 p-4 bg-background">
                <div className="w-full h-full border-[1px] border-secondary/10 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <span className="text-[32px] font-serif text-secondary">1974</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 leading-tight">Established as a Private Atelier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-40 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50vw] h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622372738946-629715071d3e?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-fixed grayscale invert" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-16">
            <h2 className="text-4xl md:text-7xl font-serif tracking-tighter leading-none">
              A commitment to <br /> <span className="italic text-secondary">the permanent.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">01. Selection</p>
                <p className="text-sm text-white/60 leading-relaxed">We source materials that have already stood the test of time—ancient timbers, mineral-heavy stones, and natural resins that age with dignity.</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">02. Execution</p>
                <p className="text-sm text-white/60 leading-relaxed">Our artisans utilize joinery techniques that have remained unchanged for centuries, ensuring a structural integrity that spans generations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 bg-[#faf9f6] text-center space-y-12">
        <div className="space-y-4">
          <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Your Environment</span>
          <h2 className="text-5xl md:text-7xl font-serif text-primary tracking-tight">Begin your <span className="italic">curation.</span></h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
          <Link href="/shop">
            <button className="bg-primary text-white px-12 py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-all duration-500 shadow-2xl">
              Explore Archive
            </button>
          </Link>
          <Link href="/contact" className="text-[11px] font-bold uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-all">
            Inquire for Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
