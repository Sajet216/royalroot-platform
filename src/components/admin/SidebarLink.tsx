'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
}

export function SidebarLink({ href, icon: Icon, children }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-secondary/5 text-secondary font-semibold' 
          : 'hover:bg-muted text-primary/60 hover:text-primary font-medium'
      } text-sm`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  )
}
