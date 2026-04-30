'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleSignOut}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-primary/10 hover:bg-primary/5 text-primary/70 font-semibold text-xs transition-all"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Terminate Session</span>
    </button>
  )
}
