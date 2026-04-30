import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsView } from '@/components/admin/SettingsView'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-secondary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Operational Preferences</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif text-primary tracking-tighter leading-none">Registry Preferences</h1>
            <p className="text-lg text-primary/40 font-medium max-w-xl">
              Configuring the foundational architecture of the RoyalRoot experience. Tune the engine for peak performance.
            </p>
          </div>
        </div>

        <SettingsView />
      </div>
    </div>
  )
}
