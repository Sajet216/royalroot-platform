'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-20 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-start">
          
          {/* Contact Information */}
          <div className="space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-secondary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Inquiries</p>
              </div>
              <h1 className="text-5xl lg:text-8xl font-serif text-primary tracking-tighter leading-none">Connect with <br /> <span className="italic">The Atelier.</span></h1>
              <p className="text-lg text-primary/60 font-medium max-w-md">
                For bespoke commissions, architectural consultations, or registry inquiries, our curators are available for private dialogue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 pt-10">
              <div className="flex items-start gap-6">
                <div className="bg-primary/5 p-4 rounded-full">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Email Archive</p>
                  <p className="text-lg font-serif text-primary">curator@royalroot.interiors</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-primary/5 p-4 rounded-full">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Direct Line</p>
                  <p className="text-lg font-serif text-primary">+1 (212) 882-1974</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-primary/5 p-4 rounded-full">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Physical Atelier</p>
                  <p className="text-lg font-serif text-primary">42nd Heritage Way, <br />Manhattan, NY 10012</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-primary/5 p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white shadow-xl">
                  <Check className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif text-primary">Inquiry Received.</h3>
                  <p className="text-primary/60 font-medium">A curator will reach out to you within 24 operational hours to discuss your vision.</p>
                </div>
                <Button variant="ghost" onClick={() => setSubmitted(false)} className="text-[10px] font-bold uppercase tracking-widest text-secondary">Send Another Inquiry</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Full Name</label>
                    <input type="text" required className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary placeholder:text-primary/10" placeholder="E.g. Julian Heritage" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Email Address</label>
                    <input type="email" required className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary placeholder:text-primary/10" placeholder="julian@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Subject of Inquiry</label>
                  <select className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary appearance-none cursor-pointer">
                    <option>Bespoke Commission</option>
                    <option>Architectural Consultation</option>
                    <option>Registry Assistance</option>
                    <option>Press & Archive Access</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Your Message</label>
                  <textarea required rows={4} className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-lg text-primary placeholder:text-primary/10 resize-none" placeholder="Describe the atmosphere you wish to create..." />
                </div>

                <Button type="submit" className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-none font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 shadow-xl group">
                  <span className="flex items-center gap-3">
                    Transmit Inquiry <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Button>
                
                <p className="text-[9px] text-center text-primary/30 italic">By transmitting, you agree to our private heritage data protocols.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
