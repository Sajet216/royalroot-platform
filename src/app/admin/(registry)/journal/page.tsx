import { JournalDashboard } from '@/components/admin/JournalDashboard'

export default function AdminJournalPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-secondary" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Editorial Management</p>
        </div>
        <h1 className="text-4xl lg:text-6xl font-serif text-primary tracking-tighter">The RoyalRoot <span className="italic">Journal.</span></h1>
        <p className="text-primary/60 font-medium max-w-2xl leading-relaxed">
          Curation of architectural narratives, design philosophies, and craftsmanship stories.
        </p>
      </div>

      <JournalDashboard />
    </div>
  )
}
