'use client'

import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import { SignOutButton } from '@/components/auth/SignOutButton'

export function ProfileView({ user }: { user: any }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-white border border-primary/5 p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
          <User className="w-16 h-16" />
        </div>
        
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-primary">{user.user_metadata?.full_name || 'Anonymous Curator'}</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Master Administrator</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-primary/5">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-3 h-3" /> Communication Node
              </h3>
              <p className="text-sm font-medium text-primary">{user.email}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2 justify-center md:justify-start">
                <Shield className="w-3 h-3" /> Clearance Level
              </h3>
              <p className="text-sm font-medium text-primary">System Administrator (Lvl 1)</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2 justify-center md:justify-start">
                <Calendar className="w-3 h-3" /> Induction Date
              </h3>
              <p className="text-sm font-medium text-primary">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-primary/5 p-8 flex justify-between items-center shadow-sm">
        <div className="space-y-1">
          <p className="text-sm font-serif text-primary">Session Termination</p>
          <p className="text-[10px] text-primary/30">Securely exit the registry portal</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}
