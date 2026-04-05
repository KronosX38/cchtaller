// app/(dashboard)/ordenes/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Wrench,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface Orden {
  id: string
  numero: string
  fecha: string
  cliente: {
    nombre: string
  }
  motocicleta: {
    modeloMoto?: {
      marca: { nombre: string }
      nombre: string
    }
    marcaManual?: string
    modeloManual?: string
    placa?: string
  }
  estadoOrden: string
  total: number
  mecanico?: {
    nombre: string
  }
}

const estadoColors: Record<string, string> = {
  recibida: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  en_diagnostico: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  en_reparacion: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  completada: 'bg-green-500/20 text-green-400 border-green-500/30',
  entregada: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelada: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const estadoIcons: Record<string, any> = {
  recibida: Clock,
  en_diagnostico: Search,
  en_reparacion: Wrench,
  completada: CheckCircle,
  entregada: CheckCircle,
  cancelada: XCircle,
}

export default function OrdenesPage() {
  const router = useRouter()
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    try {
      const res = await fetch('/api/ordenes')
      if (res.ok) {
        const data = await res.json()
        setOrdenes(data)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const ordenesFiltradas = ordenes.filter((orden) => {
    const coincideBusqueda =
      orden.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.motocicleta.placa?.toLowerCase().includes(searchTerm.toLowerCase())

    const coincideEstado =
      filtroEstado === 'todas' || orden.estadoOrden === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  const obtenerNombreMoto = (moto: Orden['motocicleta']) => {
    if (moto.modeloMoto) {
      return `${moto.modeloMoto.marca.nombre} ${moto.modeloMoto.nombre}`
    }
    return `${moto.marcaManual || ''} ${moto.modeloManual || ''}`.trim() || 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando órdenes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Órdenes de Servicio</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gestiona las órdenes de servicio del taller
          </p>
        </div>
        <button
          onClick={() => router.push('/ordenes/nueva')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Orden
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número, cliente o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="todas">Todos los estados</option>
                <option value="recibida">Recibida</option>
                <option value="en_diagnostico">En diagnóstico</option>
                <option value="en_reparacion">En reparación</option>
                <option value="completada">Completada</option>
                <option value="entregada">Entregada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#0d0f12]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Motocicleta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Mecánico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#1a1d24] divide-y divide-gray-700">
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm || filtroEstado !== 'todas'
                      ? 'No se encontraron órdenes con los filtros aplicados'
                      : 'No hay órdenes de servicio registradas'}
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((orden) => {
                  const EstadoIcon = estadoIcons[orden.estadoOrden] || Clock
                  
                  return (
                    <tr key={orden.id} className="hover:bg-[#0d0f12] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          #{orden.numero}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{orden.cliente.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {obtenerNombreMoto(orden.motocicleta)}
                        </div>
                        {orden.motocicleta.placa && (
                          <div className="text-xs text-gray-500">
                            {orden.motocicleta.placa}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {orden.mecanico?.nombre || 'Sin asignar'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            estadoColors[orden.estadoOrden] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}
                        >
                          <EstadoIcon className="w-3.5 h-3.5" />
                          {orden.estadoOrden.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {formatearPrecio(orden.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatearFecha(orden.fecha)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/ordenes/${orden.id}`)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => router.push(`/ordenes/${orden.id}/editar`)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1d24] p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">Total órdenes</div>
          <div className="text-2xl font-bold text-white mt-1">{ordenes.length}</div>
        </div>
        <div className="bg-[#1a1d24] p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">En proceso</div>
          <div className="text-2xl font-bold text-orange-400 mt-1">
            {ordenes.filter((o) => ['recibida', 'en_diagnostico', 'en_reparacion'].includes(o.estadoOrden)).length}
          </div>
        </div>
        <div className="bg-[#1a1d24] p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">Completadas</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {ordenes.filter((o) => o.estadoOrden === 'completada').length}
          </div>
        </div>
        <div className="bg-[#1a1d24] p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">Entregadas</div>
          <div className="text-2xl font-bold text-gray-400 mt-1">
            {ordenes.filter((o) => o.estadoOrden === 'entregada').length}
          </div>
        </div>
      </div>
    </div>
  )
}