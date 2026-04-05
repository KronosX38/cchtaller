// components/layout/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  icon: any
  badge?: number
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Órdenes de Servicio', href: '/ordenes', icon: FileText, badge: 5 },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Ventas', href: '/ventas', icon: ShoppingCart },
  { name: 'Citas', href: '/citas', icon: Calendar },
  { name: 'Recursos Humanos', href: '/rrhh', icon: User },
  { name: 'Inversiones', href: '/inversiones', icon: DollarSign },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-[var(--color-premium-900)] border-r-2 border-[var(--color-premium-800)] flex flex-col z-50 transition-transform duration-300",
        // En móvil: se desliza desde la izquierda
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b-2 border-[var(--color-premium-800)]">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-naranja)] to-[var(--color-naranja-dark)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow-naranja)] group-hover:scale-110 transition-transform p-1">
                <img
                  src="/cch_logo.svg"
                  alt="CCH Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CCH Taller</h1>
                <p className="text-xs text-[var(--color-premium-400)]">Sistema CRM</p>
              </div>
            </Link>

            {/* Botón cerrar (solo móvil) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-premium-400)]" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-premium">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-[var(--color-premium-800)] group relative',
                    isActive && 'bg-[var(--color-naranja)] hover:bg-[var(--color-naranja-dark)] shadow-[var(--shadow-glow-naranja)]'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-[var(--color-premium-400)] group-hover:text-white'
                  )} />
                  <span className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-white' : 'text-[var(--color-premium-300)] group-hover:text-white'
                  )}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-[var(--color-error)] text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t-2 border-[var(--color-premium-800)]">
          <Link
            href="/configuracion"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-premium-800)] transition-all duration-200 mb-2"
          >
            <Settings className="w-5 h-5 text-[var(--color-premium-400)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--color-premium-300)]">Configuración</span>
          </Link>

          <button
            onClick={() => {/* TODO: Logout */}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-error)]/10 hover:border-[var(--color-error)] border-2 border-transparent transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--color-error)]">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}