// app/(dashboard)/dashboard/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  AlertCircle,
  Package,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-sm lg:text-base text-[var(--color-premium-400)]">Resumen general de tu taller</p>
      </div>

      {/* KPIs Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Ventas Hoy */}
        <Card className="hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-[var(--color-naranja)]/10 rounded-lg">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-naranja)]" />
              </div>
              <span className="text-[var(--color-success)] text-xs lg:text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                +12.5%
              </span>
            </div>
            <div>
              <p className="text-[var(--color-premium-400)] text-xs lg:text-sm mb-1">Ventas Hoy</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">$12,450</p>
            </div>
          </CardContent>
        </Card>

        {/* Órdenes Activas */}
        <Card className="hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-[var(--color-info)]/10 rounded-lg">
                <Wrench className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-info)]" />
              </div>
              <span className="text-[var(--color-warning)] text-xs lg:text-sm font-semibold">5 pendientes</span>
            </div>
            <div>
              <p className="text-[var(--color-premium-400)] text-xs lg:text-sm mb-1">Órdenes Activas</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">8</p>
            </div>
          </CardContent>
        </Card>

        {/* Clientes Atendidos */}
        <Card className="hover:scale-105 transition-transform cursor-pointer">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-[var(--color-success)]/10 rounded-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-success)]" />
              </div>
              <span className="text-[var(--color-success)] text-xs lg:text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                +8.2%
              </span>
            </div>
            <div>
              <p className="text-[var(--color-premium-400)] text-xs lg:text-sm mb-1">Clientes (Mes)</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">156</p>
            </div>
          </CardContent>
        </Card>

        {/* Stock Bajo */}
        <Card className="hover:scale-105 transition-transform cursor-pointer border-[var(--color-warning)]/50">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 bg-[var(--color-warning)]/10 rounded-lg">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--color-warning)]" />
              </div>
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--color-warning)]" />
            </div>
            <div>
              <p className="text-[var(--color-premium-400)] text-xs lg:text-sm mb-1">Productos Stock Bajo</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido adicional - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Órdenes Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 lg:p-4 bg-[var(--color-premium-800)] rounded-lg hover:bg-[var(--color-premium-700)] transition-all cursor-pointer">
                  <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[var(--color-naranja)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--color-naranja)] font-bold text-xs lg:text-sm">#{2947 + i}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm lg:text-base truncate">Juan Pérez</p>
                      <p className="text-[var(--color-premium-400)] text-xs lg:text-sm truncate">Yamaha R15 - YUC-123</p>
                    </div>
                  </div>
                  <span className="px-2 lg:px-3 py-1 bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ml-2">
                    En proceso
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card className="border-[var(--color-warning)]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--color-warning)] flex-shrink-0" />
              <span className="truncate">Alertas y Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 lg:p-4 bg-[var(--color-error)]/10 border-l-4 border-[var(--color-error)] rounded">
                <p className="text-[var(--color-error)] font-semibold text-xs lg:text-sm">Stock crítico: Aceite Castrol</p>
                <p className="text-[var(--color-premium-400)] text-xs mt-1">Quedan solo 3 unidades</p>
              </div>
              <div className="p-3 lg:p-4 bg-[var(--color-warning)]/10 border-l-4 border-[var(--color-warning)] rounded">
                <p className="text-[var(--color-warning)] font-semibold text-xs lg:text-sm">Orden #2945 atrasada</p>
                <p className="text-[var(--color-premium-400)] text-xs mt-1">Prometida para hoy 5:00 PM</p>
              </div>
              <div className="p-3 lg:p-4 bg-[var(--color-info)]/10 border-l-4 border-[var(--color-info)] rounded">
                <p className="text-[var(--color-info)] font-semibold text-xs lg:text-sm">5 citas programadas mañana</p>
                <p className="text-[var(--color-premium-400)] text-xs mt-1">Revisar agenda del día</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}