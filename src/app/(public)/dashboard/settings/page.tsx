'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { User, Mail, MapPin, Phone, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States'
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Fetch profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || 'United States'
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      alert('Error updating profile: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-secondary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-32 pb-40">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl space-y-16">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/30 hover:text-secondary transition-colors group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-secondary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Operational Identity</p>
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-primary tracking-tighter leading-none">Personal <br /> Heritage.</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <form onSubmit={handleUpdate} className="bg-white border border-primary/5 p-10 lg:p-16 space-y-12 shadow-sm">
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40">Core Details</h3>
                  <User className="w-4 h-4 text-primary/10" />
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Full Legal Name</label>
                    <input 
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-xl text-primary" 
                    />
                  </div>
                  <div className="space-y-2 opacity-50 cursor-not-allowed">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Registered Email (Read-Only)</label>
                    <div className="flex items-center justify-between py-3 border-b border-primary/5">
                      <span className="font-serif text-xl text-primary">{user?.email}</span>
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40">Communication & Logistics</h3>
                  <MapPin className="w-4 h-4 text-primary/10" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Phone Number</label>
                    <input 
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-xl text-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Primary City</label>
                    <input 
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-xl text-primary" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Default Shipping Address</label>
                  <input 
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-secondary transition-colors font-serif text-xl text-primary" 
                  />
                </div>
              </section>

              <div className="pt-6 flex items-center gap-6">
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-bold uppercase tracking-widest text-[11px] transition-all duration-500 shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {updating ? 'Securing Changes...' : 'Authorize Updates'}
                  </span>
                  <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>

                {success && (
                  <div className="flex items-center gap-2 text-secondary animate-in fade-in slide-in-from-left-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Changes Persisted</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary p-10 text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="space-y-2 relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Membership Security</p>
                <h3 className="text-2xl font-serif leading-tight">Identity Protection</h3>
              </div>
              <p className="text-xs text-white/60 leading-relaxed relative">
                Your architectural identity is secured via end-to-end encryption. Updating your heritage details ensures white-glove logistics precision.
              </p>
            </div>

            <div className="border border-primary/5 p-8 space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/30">System Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-primary/40">Encryption</span>
                  <span className="text-secondary">Active</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-primary/40">Sync Status</span>
                  <span className="text-secondary">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
