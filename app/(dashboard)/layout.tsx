// app/(dashboard)/layout.tsx
'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-premium-black)] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto scrollbar-premium">
          {children}
        </main>
      </div>
    </div>
  )
}