'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#775a19', '#1a1c1a', '#faf9f6']
    })
  }, [])

  return (
    <div className="bg-background min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 max-w-3xl text-center space-y-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-secondary animate-in zoom-in duration-1000">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Acquisition Confirmed</span>
            <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-tighter leading-none">A masterpiece <br /> <span className="italic">is yours.</span></h1>
          </div>
        </div>

        <p className="text-lg text-primary/60 font-medium max-w-lg mx-auto leading-relaxed">
          Your transmission has been authorized. We are now preparing your acquisitions for white-glove transport. A detailed ledger has been sent to your email.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto pt-10">
          <div className="bg-white border border-primary/5 p-8 text-left space-y-4 shadow-sm">
            <Mail className="w-5 h-5 text-secondary" />
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Confirmation Ledger</p>
              <p className="text-sm font-serif text-primary">Check your inbox for acquisition reference #ACQ-RR-2025</p>
            </div>
          </div>
          <div className="bg-white border border-primary/5 p-8 text-left space-y-4 shadow-sm">
            <Calendar className="w-5 h-5 text-secondary" />
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Transport Timeline</p>
              <p className="text-sm font-serif text-primary">Curator contact within 24 operational hours.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 items-center pt-10">
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-16 font-bold uppercase tracking-widest text-[11px] shadow-2xl transition-all duration-500">
              View Your Collection
            </Button>
          </Link>
          <Link href="/shop" className="text-[11px] font-bold uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-all">
            Continue Exploration
          </Link>
        </div>
      </div>
    </div>
  )
}
