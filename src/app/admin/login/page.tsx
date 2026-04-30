'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#faf9f6]">
      <div className="p-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Storefront
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/5 mb-4">
              <Lock className="w-5 h-5 text-secondary" />
            </div>
            <h1 className="text-4xl font-serif text-primary tracking-tight">Executive Portal</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Internal Registry Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 group-focus-within:text-secondary transition-colors">
                  Security Identifier
                </label>
                <input
                  type="email"
                  placeholder="curator@royalroot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm text-primary focus:ring-0 focus:border-secondary transition-all placeholder:text-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 group-focus-within:text-secondary transition-colors">
                  Access Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b border-primary/10 px-0 py-3 text-sm text-primary focus:ring-0 focus:border-secondary transition-all placeholder:text-primary/20 outline-none"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-secondary transition-all duration-500 shadow-xl"
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Authorize Entrance'}
            </Button>
          </form>

          <div className="pt-12 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/20 leading-loose">
              Protected Environment <br />
              &copy; 2026 RoyalRoot Interiors Heritage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

