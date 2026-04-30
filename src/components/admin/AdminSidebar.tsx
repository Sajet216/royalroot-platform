'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, TrendingUp, User, Layers, Settings, BookOpen } from 'lucide-react'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { SidebarLink } from './SidebarLink'

interface AdminSidebarProps {
  userEmail?: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  return (
    <div className="w-64 border-r border-primary/5 bg-white flex flex-col shadow-sm">
      <div className="h-24 flex items-center px-8 border-b border-primary/5">
        <Link href="/admin" className="flex flex-col group">
          <span className="font-serif text-xl text-primary tracking-tight leading-none group-hover:text-secondary transition-colors">RoyalRoot</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60 mt-1">Admin Portal</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-6 space-y-8">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-4 px-2">Management</p>
          <SidebarLink href="/admin" icon={LayoutDashboard}>
            Inventory
          </SidebarLink>
          <SidebarLink href="/admin/orders" icon={ShoppingBag}>
            Orders
          </SidebarLink>
          <SidebarLink href="/admin/customers" icon={User}>
            Customers
          </SidebarLink>
          <SidebarLink href="/admin/analytics" icon={TrendingUp}>
            Analytics
          </SidebarLink>
          <SidebarLink href="/admin/categories" icon={Layers}>
            Categories
          </SidebarLink>
          <SidebarLink href="/admin/journal" icon={BookOpen}>
            Journal
          </SidebarLink>
          <SidebarLink href="/" icon={User}>
            View Site
          </SidebarLink>
        </div>

        <div className="space-y-1 pt-4 border-t border-primary/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-4 px-2">System</p>
          <SidebarLink href="/admin/settings" icon={Settings}>
            Preferences
          </SidebarLink>
          <SidebarLink href="/admin/profile" icon={User}>
            Profile
          </SidebarLink>
        </div>
      </nav>

      <div className="p-6 border-t border-primary/5">
        <div className="mb-4 px-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/20">Active Curator</p>
          <p className="text-[11px] font-medium text-primary/60 truncate">{userEmail}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}
