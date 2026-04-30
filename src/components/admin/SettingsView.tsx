'use client'

import { Settings, Globe, Bell, Shield, Database, Layout } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'Global Registry', icon: Globe },
    { id: 'notifications', label: 'Alert Protocols', icon: Bell },
    { id: 'security', label: 'Guardian Shield', icon: Shield },
    { id: 'system', label: 'Core Engine', icon: Database },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
      {/* Settings Navigation */}
      <div className="w-full lg:w-64 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all border ${
              activeTab === tab.id 
                ? 'bg-white border-primary/10 text-secondary shadow-sm' 
                : 'border-transparent text-primary/40 hover:text-primary hover:bg-white/50'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-secondary' : 'text-primary/20'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white border border-primary/5 p-12 shadow-sm min-h-[500px]">
        {activeTab === 'general' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-primary">Global Registry Configuration</h3>
              <p className="text-sm text-primary/40 max-w-xl italic">
                Manage the foundational parameters of the RoyalRoot digital experience. These settings propagate across the entire architectural stack.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Registry Identity (Site Title)</label>
                <input 
                  defaultValue="RoyalRoot Interiors"
                  className="w-full bg-transparent border-0 border-b border-primary/10 py-3 text-lg font-serif text-primary focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Primary Fiscal Denomination</label>
                <select className="w-full bg-transparent border-0 border-b border-primary/10 py-3 text-lg font-serif text-primary focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer">
                  <option>USD - United States Dollar</option>
                  <option>EUR - Euro Architecture</option>
                  <option>GBP - British Heritage Pound</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                <div className="space-y-1">
                  <p className="text-sm font-serif text-primary">Architectural Silence Mode</p>
                  <p className="text-[10px] text-primary/30 uppercase tracking-widest font-bold">Maintenance Protocol</p>
                </div>
                <div className="w-12 h-6 bg-primary/5 rounded-full relative cursor-pointer group">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-primary/20 rounded-full transition-all group-hover:bg-secondary/40" />
                </div>
              </div>
            </div>
            
            <div className="pt-12 flex justify-end">
              <Button className="bg-primary hover:bg-secondary text-white rounded-none px-12 h-14 font-serif text-lg transition-all duration-500 shadow-xl">
                Authorize Changes
              </Button>
            </div>
          </div>
        )}

        {activeTab !== 'general' && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <Layout className="w-12 h-12 text-primary/5" />
            <div className="space-y-2">
              <p className="text-lg font-serif text-primary/40 italic">Registry Protocol Under Construction</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/20">Access denied by system architect</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
