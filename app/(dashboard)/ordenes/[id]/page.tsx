// app/(dashboard)/ordenes/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Edit,
  Package,
  Wrench,
  CheckSquare,
  Calendar,
  User,
  Bike,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface Orden {
  id: string
  numero: string
  fecha: string
  fechaEntrega?: string
  tipoServicio: string
  estadoOrden: string
  kilometrajeEntrada?: number
  kilometrajeSalida?: number
  nivelCombustible?: string
  observacionesCliente?: string
  observacionesMecanico?: string
  subtotalManoObra: number
  subtotalRepuestos: number
  subtotal: number
  iva: number
  total: number
  metodoPago?: string
  conGarantia: boolean
  diasGarantia: number
  mostrarDesglose: boolean
  cliente: {
    nombre: string
    telefono: string
    email?: string
    direccion?: string
  }
  motocicleta: {
    modeloMoto?: {
      marca: { nombre: string }
      nombre: string
      cilindrada?: string
    }
    marcaManual?: string
    modeloManual?: string
    placa?: string
  }
  sucursal: {
    nombre: string
  }
  mecanico?: {
    nombre: string
  }
  detalles: Array<{
    id: string
    descripcion: string
    cantidad: number
    precioUnitario: number
    subtotal: number
    servicioManoObra?: {
      nombre: string
    }
  }>
  repuestos: Array<{
    id: string
    nombre: string
    cantidad: number
    precioVenta: number
    subtotal: number
  }>
  checklist: Array<{
    item: string
    estado: string
    observacion?: string
  }>
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
  en_diagnostico: AlertCircle,
  en_reparacion: Wrench,
  completada: CheckCircle2,
  entregada: CheckCircle2,
  cancelada: XCircle,
}

export default function OrdenDetallePage() {
  const router = useRouter()
  const params = useParams()
  const [orden, setOrden] = useState<Orden | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      cargarOrden()
    }
  }, [params.id])

  const cargarOrden = async () => {
    try {
      const res = await fetch(`/api/ordenes/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setOrden(data)
      } else {
        console.error('Error al cargar orden')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
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

  const calcularGarantia = () => {
    if (!orden?.fechaEntrega || !orden.conGarantia) return null

    const fechaEntrega = new Date(orden.fechaEntrega)
    const fechaVencimiento = new Date(fechaEntrega)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + orden.diasGarantia)

    const hoy = new Date()
    const diasRestantes = Math.ceil(
      (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      vence: fechaVencimiento,
      diasRestantes,
      vigente: diasRestantes > 0,
    }
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
        <div className="text-gray-400">Cargando orden...</div>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-gray-400">Orden no encontrada</div>
        <button
          onClick={() => router.push('/ordenes')}
          className="text-blue-400 hover:text-blue-300"
        >
          Volver a órdenes
        </button>
      </div>
    )
  }

  const garantia = calcularGarantia()
  const EstadoIcon = estadoIcons[orden.estadoOrden] || Clock

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/ordenes')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Orden #{orden.numero}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {formatearFecha(orden.fecha)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
              estadoColors[orden.estadoOrden]
            }`}
          >
            <EstadoIcon className="w-4 h-4" />
            {orden.estadoOrden.replace(/_/g, ' ')}
          </span>

          <button
            onClick={() => router.push(`/ordenes/${orden.id}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>

          <button
            onClick={() => {
              // TODO: Abrir modal de impresión
              alert('Función de impresión próximamente')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Garantía */}
      {garantia && (
        <div
          className={`p-4 rounded-lg border ${
            garantia.vigente
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {garantia.vigente ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                garantia.vigente ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {garantia.vigente
                ? `Garantía vigente: ${garantia.diasRestantes} días restantes`
                : `Garantía vencida hace ${Math.abs(garantia.diasRestantes)} días`}
            </span>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Info Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">
                Información del Cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Nombre</div>
                <div className="text-white font-medium mt-1">
                  {orden.cliente.nombre}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400">Teléfono</div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-white">{orden.cliente.telefono}</span>
                </div>
              </div>

              {orden.cliente.email && (
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-white">{orden.cliente.email}</span>
                  </div>
                </div>
              )}

              {orden.cliente.direccion && (
                <div>
                  <div className="text-sm text-gray-400">Dirección</div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-white">{orden.cliente.direccion}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información de la Motocicleta */}
          <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Motocicleta</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Modelo</div>
                <div className="text-white font-medium mt-1">
                  {obtenerNombreMoto(orden.motocicleta)}
                </div>
              </div>

              {orden.motocicleta.placa && (
                <div>
                  <div className="text-sm text-gray-400">Placa</div>
                  <div className="text-white font-medium mt-1">
                    {orden.motocicleta.placa}
                  </div>
                </div>
              )}

              {orden.kilometrajeEntrada && (
                <div>
                  <div className="text-sm text-gray-400">Kilometraje Entrada</div>
                  <div className="text-white font-medium mt-1">
                    {orden.kilometrajeEntrada.toLocaleString()} km
                  </div>
                </div>
              )}

              {orden.kilometrajeSalida && (
                <div>
                  <div className="text-sm text-gray-400">Kilometraje Salida</div>
                  <div className="text-white font-medium mt-1">
                    {orden.kilometrajeSalida.toLocaleString()} km
                  </div>
                </div>
              )}

              {orden.nivelCombustible && (
                <div>
                  <div className="text-sm text-gray-400">Nivel Combustible</div>
                  <div className="text-white font-medium mt-1 capitalize">
                    {orden.nivelCombustible.replace(/_/g, ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trabajos de Mano de Obra */}
          {orden.detalles.length > 0 && (
            <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">
                  Trabajos de Mano de Obra
                </h2>
              </div>

              <div className="space-y-3">
                {orden.detalles.map((detalle) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between p-3 bg-[#0d0f12] rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {detalle.descripcion}
                      </div>
                      <div className="text-sm text-gray-400">
                        Cantidad: {detalle.cantidad} × {formatearPrecio(detalle.precioUnitario)}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {formatearPrecio(detalle.subtotal)}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Subtotal Mano de Obra:</span>
                  <span className="text-lg font-semibold text-white">
                    {formatearPrecio(orden.subtotalManoObra)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Repuestos */}
          {orden.repuestos.length > 0 && (
            <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Repuestos</h2>
              </div>

              <div className="space-y-3">
                {orden.repuestos.map((repuesto) => (
                  <div
                    key={repuesto.id}
                    className="flex items-center justify-between p-3 bg-[#0d0f12] rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{repuesto.nombre}</div>
                      <div className="text-sm text-gray-400">
                        Cantidad: {repuesto.cantidad} × {formatearPrecio(repuesto.precioVenta)}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {formatearPrecio(repuesto.subtotal)}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Subtotal Repuestos:</span>
                  <span className="text-lg font-semibold text-white">
                    {formatearPrecio(orden.subtotalRepuestos)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          {orden.checklist.length > 0 && (
            <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">
                  Inspección Visual
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {orden.checklist.map((item, index) => (
                  <div key={index} className="p-3 bg-[#0d0f12] rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">{item.item}</div>
                    <div
                      className={`text-sm font-medium ${
                        item.estado === 'bueno'
                          ? 'text-green-400'
                          : item.estado === 'regular'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {item.estado.toUpperCase()}
                    </div>
                    {item.observacion && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.observacion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observaciones */}
          {(orden.observacionesCliente || orden.observacionesMecanico) && (
            <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Observaciones
              </h2>

              <div className="space-y-4">
                {orden.observacionesCliente && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Del Cliente:</div>
                    <div className="text-white bg-[#0d0f12] p-3 rounded-lg">
                      {orden.observacionesCliente}
                    </div>
                  </div>
                )}

                {orden.observacionesMecanico && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Del Mecánico:</div>
                    <div className="text-white bg-[#0d0f12] p-3 rounded-lg">
                      {orden.observacionesMecanico}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

{/* Columna Derecha - Resumen */}
        <div className="space-y-6">
          {/* Información General */}
          <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Información General
            </h2>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Tipo de Servicio</div>
                <div className="text-white font-medium mt-1 capitalize">
                  {orden.tipoServicio.replace(/_/g, ' ')}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400">Sucursal</div>
                <div className="text-white font-medium mt-1">
                  {orden.sucursal.nombre}
                </div>
              </div>

              {orden.mecanico && (
                <div>
                  <div className="text-sm text-gray-400">Mecánico Asignado</div>
                  <div className="text-white font-medium mt-1">
                    {orden.mecanico.nombre}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-400">Fecha de Recepción</div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-white text-sm">
                    {formatearFecha(orden.fecha)}
                  </span>
                </div>
              </div>

              {orden.fechaEntrega && (
                <div>
                  <div className="text-sm text-gray-400">Fecha de Entrega</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-white text-sm">
                      {formatearFecha(orden.fechaEntrega)}
                    </span>
                  </div>
                </div>
              )}

              {orden.metodoPago && (
                <div>
                  <div className="text-sm text-gray-400">Método de Pago</div>
                  <div className="text-white font-medium mt-1 capitalize">
                    {orden.metodoPago.replace(/_/g, ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen de Costos */}
          <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Resumen de Costos
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mano de Obra:</span>
                <span className="text-white font-medium">
                  {formatearPrecio(orden.subtotalManoObra)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Repuestos:</span>
                <span className="text-white font-medium">
                  {formatearPrecio(orden.subtotalRepuestos)}
                </span>
              </div>

              <div className="flex justify-between text-sm pt-3 border-t border-gray-700">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white font-medium">
                  {formatearPrecio(orden.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">IVA (16%):</span>
                <span className="text-white font-medium">
                  {formatearPrecio(orden.iva)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-600">
                <span className="text-white">Total:</span>
                <span className="text-blue-400">
                  {formatearPrecio(orden.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Acciones Rápidas
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => {
                  alert('Función de impresión próximamente')
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir Orden
              </button>

              <button
                onClick={() => router.push(`/ordenes/${orden.id}/editar`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Orden
              </button>

              {orden.estadoOrden === 'completada' && !orden.fechaEntrega && (
                <button
                  onClick={() => {
                    // TODO: Modal para marcar como entregada
                    alert('Función de entrega próximamente')
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar como Entregada
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}