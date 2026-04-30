import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderDashboard } from '@/components/admin/OrderDashboard'

export default async function AdminOrdersPage() {
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
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Logistics Registry</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif text-primary tracking-tighter leading-none">Acquisition Registry</h1>
            <p className="text-lg text-primary/40 font-medium max-w-xl">
              Overseeing the transition of heritage from archive to collector. Maintain the sanctity of every fulfillment protocol.
            </p>
          </div>
          
          <div className="bg-white p-6 border border-primary/5 shadow-sm min-w-[240px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/30 mb-1">Authenticated Curator</p>
            <p className="text-sm font-bold text-primary truncate">{session.user.email}</p>
            <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">Logistics Active</span>
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <OrderDashboard />
      </div>
    </div>
  )
}
