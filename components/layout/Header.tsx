// components/layout/Header.tsx
'use client'

import { Bell, Search, User, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-premium-900)]/80 backdrop-blur-xl border-b-2 border-[var(--color-premium-800)]">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 gap-4">
        {/* Botón hamburguesa (solo móvil) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-premium-500)]" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg text-white placeholder:text-[var(--color-premium-500)] focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <button className="relative p-3 hover:bg-[var(--color-premium-800)] rounded-lg transition-all">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-premium-300)]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-2 lg:px-4 py-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-all cursor-pointer">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[var(--color-naranja)] to-[var(--color-naranja-dark)] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white">Administrador</p>
              <p className="text-xs text-[var(--color-premium-400)]">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}