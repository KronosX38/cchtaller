// app/(dashboard)/ordenes/nueva/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Search,
  Plus,
  X,
  Wrench,
  Package,
  CheckSquare,
  AlertCircle
} from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  sucursal?: {
    id: string
    nombre: string
  }
  motocicletas: Motocicleta[]
}

interface Motocicleta {
  id: string
  modeloMoto?: {
    id: string
    nombre: string
    marca: { nombre: string }
    cilindrada?: string
    categoria?: string
    precioMantenimiento1?: number
  }
  marcaManual?: string
  modeloManual?: string
  placa?: string
  kilometraje?: number
}

interface Mecanico {
  id: string
  nombre: string
  sucursal?: { nombre: string }
}

interface Producto {
  id: string
  nombre: string
  codigo?: string
  categoria: string
  stockActual: number
  precioCompra: number | any
  precioVenta: number | any
}

interface ServicioManoObra {
  id: string
  categoria: string
  nombre: string
  precioSemiautomatica: number
  precioMontoneta: number
  precioUrbana: number
  precioUrbanaGrande: number
  precioTrabajo: number
  aumentoAnual: number
}

interface DetalleServicio {
  servicioManoObraId?: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface Repuesto {
  productoId?: string
  nombre: string
  descripcion: string
  cantidad: number
  precioCompra: number
  precioVenta: number
  subtotal: number
}

interface ItemChecklist {
  item: string
  estado: string
  observacion?: string
}

const ITEMS_CHECKLIST = [
  'Espejos',
  'Faro delantero',
  'Direccionales',
  'Tanque de gasolina',
  'Asiento',
  'Luz de stop',
  'Luz de cuartos',
  'Cubiertas laterales',
  'Tacómetro',
  'Batería',
  'Switch de encendido',
  'Pedales',
  'Claxon',
  'Accesorios',
  'Parrilla',
  'Llantas',
  'Rines',
  'Salpicaderas',
  'Fugas',
  'Cadena',
  'Sistema eléctrico',
  'Suspensión',
]

export default function NuevaOrdenPage() {
  const router = useRouter()

  // Estados principales
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [motoSeleccionada, setMotoSeleccionada] = useState<Motocicleta | null>(null)
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [serviciosManoObra, setServiciosManoObra] = useState<ServicioManoObra[]>([])

  // Datos de la orden
  const [tipoServicio, setTipoServicio] = useState('mantenimiento_preventivo')
  const [mecanicoId, setMecanicoId] = useState('')
  const [kilometrajeEntrada, setKilometrajeEntrada] = useState('')
  const [nivelCombustible, setNivelCombustible] = useState('medio')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [observacionesCliente, setObservacionesCliente] = useState('')
  const [observacionesMecanico, setObservacionesMecanico] = useState('')
  const [mostrarDesglose, setMostrarDesglose] = useState(false)

  // Arrays de detalles
  const [detalles, setDetalles] = useState<DetalleServicio[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [checklist, setChecklist] = useState<ItemChecklist[]>(
    ITEMS_CHECKLIST.map(item => ({ item, estado: 'bueno', observacion: '' }))
  )

  // UI States
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [mostrarClientes, setMostrarClientes] = useState(false)
  const [busquedaServicio, setBusquedaServicio] = useState('')
  const [mostrarServicios, setMostrarServicios] = useState(false)
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [mostrarProductos, setMostrarProductos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [resClientes, resMecanicos, resProductos, resServicios] = await Promise.all([
        fetch('/api/clientes?activo=true'),
        fetch('/api/mecanicos'),
        fetch('/api/productos'),
        fetch('/api/servicios-mano-obra'),
      ])

      if (resClientes.ok) {
        const data = await resClientes.json()
        setClientes(data)
      }
      if (resMecanicos.ok) {
        const data = await resMecanicos.json()
        setMecanicos(data)
      }
      if (resProductos.ok) {
        const data = await resProductos.json()
        setProductos(data)
      }
      if (resServicios.ok) {
        const data = await resServicios.json()
        setServiciosManoObra(data)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  // Filtros de búsqueda
  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.telefono.includes(busquedaCliente)
  )

  const serviciosFiltrados = serviciosManoObra.filter(s =>
    s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  )

  const productosFiltrados = productos.filter(p =>
    (p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(busquedaProducto.toLowerCase())) &&
    p.stockActual > 0
  )

  // Seleccionar cliente
  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setMostrarClientes(false)
    setBusquedaCliente(cliente.nombre)

    // Si solo tiene una moto, seleccionarla automáticamente
    if (cliente.motocicletas && cliente.motocicletas.length === 1) {
      seleccionarMoto(cliente.motocicletas[0])
    }
  }

  // Seleccionar moto
  const seleccionarMoto = (moto: Motocicleta) => {
    setMotoSeleccionada(moto)
    if (moto.kilometraje) {
      setKilometrajeEntrada(moto.kilometraje.toString())
    }
  }

  // Calcular precio según categoría de moto
  const calcularPrecioServicio = (servicio: ServicioManoObra): number => {
    if (!motoSeleccionada?.modeloMoto?.categoria) {
      return servicio.precioUrbana * (1 + servicio.aumentoAnual)
    }

    const categoria = motoSeleccionada.modeloMoto.categoria
    let precioBase = servicio.precioUrbana

    switch (categoria) {
      case 'semiautomatica':
        precioBase = servicio.precioSemiautomatica
        break
      case 'motoneta':
        precioBase = servicio.precioMontoneta
        break
      case 'urbana':
        precioBase = servicio.precioUrbana
        break
      case 'urbana_grande':
        precioBase = servicio.precioUrbanaGrande
        break
      case 'trabajo':
        precioBase = servicio.precioTrabajo
        break
    }

    return precioBase * (1 + servicio.aumentoAnual)
  }

  // Agregar servicio de mano de obra
  const agregarServicio = (servicio: ServicioManoObra) => {
    const precio = calcularPrecioServicio(servicio)
    const nuevoDetalle: DetalleServicio = {
      servicioManoObraId: servicio.id,
      descripcion: servicio.nombre,
      cantidad: 1,
      precioUnitario: precio,
      subtotal: precio,
    }

    setDetalles([...detalles, nuevoDetalle])
    setMostrarServicios(false)
    setBusquedaServicio('')
  }

  // Agregar repuesto
  const agregarRepuesto = (producto: Producto) => {
    const precioVenta = parseFloat(producto.precioVenta.toString())
    const precioCompra = parseFloat(producto.precioCompra.toString())

    const nuevoRepuesto: Repuesto = {
      productoId: producto.id,
      nombre: producto.nombre,
      descripcion: producto.nombre,
      cantidad: 1,
      precioCompra: precioCompra,
      precioVenta: precioVenta,
      subtotal: precioVenta,
    }

    setRepuestos([...repuestos, nuevoRepuesto])
    setMostrarProductos(false)
    setBusquedaProducto('')
  }

  // Actualizar cantidad de repuesto
  const actualizarCantidadRepuesto = (index: number, cantidad: number) => {
    const nuevosRepuestos = [...repuestos]
    nuevosRepuestos[index].cantidad = cantidad
    nuevosRepuestos[index].subtotal = cantidad * nuevosRepuestos[index].precioVenta
    setRepuestos(nuevosRepuestos)
  }

  // Eliminar servicio
  const eliminarServicio = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  // Eliminar repuesto
  const eliminarRepuesto = (index: number) => {
    setRepuestos(repuestos.filter((_, i) => i !== index))
  }

  // Actualizar estado de checklist
  const actualizarChecklist = (index: number, campo: 'estado' | 'observacion', valor: string) => {
    const nuevoChecklist = [...checklist]
    if (campo === 'estado') {
      nuevoChecklist[index].estado = valor
    } else {
      nuevoChecklist[index].observacion = valor
    }
    setChecklist(nuevoChecklist)
  }

  // Calcular totales
  const subtotalManoObra = detalles.reduce((sum, d) => sum + d.subtotal, 0)
  const subtotalRepuestos = repuestos.reduce((sum, r) => sum + r.subtotal, 0)
  const subtotal = subtotalManoObra + subtotalRepuestos
  const iva = subtotal * 0.16
  const total = subtotal + iva

  // Guardar orden
  const guardarOrden = async () => {
    if (!clienteSeleccionado || !motoSeleccionada) {
      setError('Debes seleccionar un cliente y una motocicleta')
      return
    }

    if (detalles.length === 0 && repuestos.length === 0) {
      setError('Debes agregar al menos un servicio o repuesto')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: clienteSeleccionado.id,
          motocicletaId: motoSeleccionada.id,
          sucursalId: clienteSeleccionado.sucursal?.id || clientes[0]?.sucursal?.id,
          mecanicoId: mecanicoId || null,
          tipoServicio,
          kilometrajeEntrada: kilometrajeEntrada ? parseInt(kilometrajeEntrada) : null,
          nivelCombustible,
          detalles,
          repuestos,
          checklist: checklist.filter(c => c.observacion || c.estado !== 'bueno'),
          metodoPago,
          observacionesCliente,
          observacionesMecanico,
          mostrarDesglose,
        }),
      })

      if (res.ok) {
        const orden = await res.json()
        router.push(`/ordenes/${orden.id}`)
      } else {
        const data = await res.json()
        setError(data.error || 'Error al crear la orden')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al guardar la orden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/ordenes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Servicio</h1>
            <p className="text-sm text-gray-500 mt-1">
              Registra una nueva orden de servicio
            </p>
          </div>
        </div>
        <button
          onClick={guardarOrden}
          disabled={loading || !clienteSeleccionado || !motoSeleccionada}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Orden'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Sección 1: Cliente y Motocicleta */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Cliente y Motocicleta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buscar cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cliente *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cliente por nombre o teléfono..."
                value={busquedaCliente}
                onChange={(e) => {
                  setBusquedaCliente(e.target.value)
                  setMostrarClientes(true)
                }}
                onFocus={() => setMostrarClientes(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Dropdown de clientes */}
              {mostrarClientes && busquedaCliente && (
                <div className="absolute z-10 w-full mt-1 bg-[#1a1d24] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {clientesFiltrados.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No se encontraron clientes
                    </div>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <button
                        key={cliente.id}
                        onClick={() => seleccionarCliente(cliente)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="font-medium text-gray-900">{cliente.nombre}</div>
                        <div className="text-sm text-gray-500">{cliente.telefono}</div>
                        {cliente.motocicletas && cliente.motocicletas.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {cliente.motocicletas.length} moto(s) registrada(s)
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {clienteSeleccionado && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">
                  {clienteSeleccionado.nombre}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {clienteSeleccionado.telefono}
                </div>
              </div>
            )}
          </div>

          {/* Seleccionar motocicleta */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motocicleta *
            </label>
            {!clienteSeleccionado ? (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500 text-center">
                Primero selecciona un cliente
              </div>
            ) : clienteSeleccionado.motocicletas?.length === 0 ? (
              <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 text-center">
                Este cliente no tiene motos registradas
              </div>
            ) : (
              <select
                value={motoSeleccionada?.id || ''}
                onChange={(e) => {
                  const moto = clienteSeleccionado.motocicletas?.find(m => m.id === e.target.value)
                  if (moto) seleccionarMoto(moto)
                }}
                className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar motocicleta...</option>
                {clienteSeleccionado.motocicletas?.map((moto) => (
                  <option key={moto.id} value={moto.id}>
                    {moto.modeloMoto
                      ? `${moto.modeloMoto.marca.nombre} ${moto.modeloMoto.nombre}`
                      : `${moto.marcaManual} ${moto.modeloManual}`}
                    {moto.placa && ` - ${moto.placa}`}
                  </option>
                ))}
              </select>
            )}

            {motoSeleccionada && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-900">
                  {motoSeleccionada.modeloMoto
                    ? `${motoSeleccionada.modeloMoto.marca.nombre} ${motoSeleccionada.modeloMoto.nombre}`
                    : `${motoSeleccionada.marcaManual} ${motoSeleccionada.modeloManual}`}
                </div>
                <div className="text-xs text-green-700 mt-1 space-x-3">
                  {motoSeleccionada.placa && <span>Placa: {motoSeleccionada.placa}</span>}
                  {motoSeleccionada.modeloMoto?.cilindrada && (
                    <span>{motoSeleccionada.modeloMoto.cilindrada}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Tipo de Servicio e Inspección */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Tipo de Servicio e Inspección
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Servicio
            </label>
            <select
              value={tipoServicio}
              onChange={(e) => setTipoServicio(e.target.value)}
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mantenimiento_preventivo">Mantenimiento preventivo</option>
              <option value="reparacion_general">Reparación general</option>
              <option value="reparacion_electrica">Reparación eléctrica</option>
              <option value="diagnostico">Diagnóstico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mecánico Asignado
            </label>
            <select
              value={mecanicoId}
              onChange={(e) => setMecanicoId(e.target.value)}
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin asignar</option>
              {mecanicos.map((mecanico) => (
                <option key={mecanico.id} value={mecanico.id}>
                  {mecanico.nombre}
                  {mecanico.sucursal && ` - ${mecanico.sucursal.nombre}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kilometraje de Entrada
            </label>
            <input
              type="number"
              value={kilometrajeEntrada}
              onChange={(e) => setKilometrajeEntrada(e.target.value)}
              placeholder="15000"
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nivel de Combustible
            </label>
            <select
              value={nivelCombustible}
              onChange={(e) => setNivelCombustible(e.target.value)}
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="vacio">Vacío</option>
              <option value="cuarto">1/4</option>
              <option value="medio">1/2</option>
              <option value="tres_cuartos">3/4</option>
              <option value="lleno">Lleno</option>
            </select>
          </div>
        </div>
      </div>
      {/* Sección 3: Trabajos de Mano de Obra */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-white-900">
              Trabajos de Mano de Obra
            </h2>
          </div>
          <button
            onClick={() => setMostrarServicios(!mostrarServicios)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar Trabajo
          </button>
        </div>

        {/* Buscador de servicios */}
        {mostrarServicios && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={busquedaServicio}
                onChange={(e) => setBusquedaServicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista de servicios */}
            <div className="mt-2 max-h-60 overflow-auto border border-gray-200 rounded-lg">
              {serviciosFiltrados.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No se encontraron servicios
                </div>
              ) : (
                serviciosFiltrados.map((servicio) => {
                  const precio = calcularPrecioServicio(servicio)
                  return (
                    <button
                      key={servicio.id}
                      onClick={() => agregarServicio(servicio)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white-900">{servicio.nombre}</div>
                          <div className="text-xs text-gray-500">{servicio.categoria}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${precio.toFixed(2)}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Lista de trabajos agregados */}
        {detalles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay trabajos agregados
          </div>
        ) : (
          <div className="space-y-2">
            {detalles.map((detalle, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{detalle.descripcion}</div>
                  <div className="text-sm text-gray-500">
                    Cantidad: {detalle.cantidad} × ${detalle.precioUnitario.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-white-900">
                    ${detalle.subtotal.toFixed(2)}
                  </div>
                  <button
                    onClick={() => eliminarServicio(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección 4: Repuestos */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-white-900">
              Repuestos Utilizados
            </h2>
          </div>
          <button
            onClick={() => setMostrarProductos(!mostrarProductos)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar Repuesto
          </button>
        </div>

        {/* Buscador de productos */}
        {mostrarProductos && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar repuesto..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista de productos */}
            <div className="mt-2 max-h-60 overflow-auto border border-gray-200 rounded-lg">
              {productosFiltrados.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  {busquedaProducto
                    ? 'No se encontraron productos'
                    : 'Escribe para buscar productos'}
                </div>
              ) : (
                productosFiltrados.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => agregarRepuesto(producto)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{producto.nombre}</div>
                        <div className="text-xs text-gray-500">
                          {producto.codigo && `${producto.codigo} • `}
                          Stock: {producto.stockActual}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${parseFloat(producto.precioVenta.toString()).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Costo: ${parseFloat(producto.precioCompra.toString()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Lista de repuestos agregados */}
        {repuestos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay repuestos agregados
          </div>
        ) : (
          <div className="space-y-2">
            {repuestos.map((repuesto, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{repuesto.nombre}</div>
                  <div className="text-sm text-gray-500">
                    ${repuesto.precioVenta.toFixed(2)} c/u
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={repuesto.cantidad}
                    onChange={(e) =>
                      actualizarCantidadRepuesto(index, parseInt(e.target.value) || 1)
                    }
                    className="w-20 px-3 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-lg font-semibold text-white-900 w-24 text-right">
                    ${repuesto.subtotal.toFixed(2)}
                  </div>
                  <button
                    onClick={() => eliminarRepuesto(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección 5: Checklist Visual */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-white-900">
            Inspección Visual
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklist.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="font-medium text-sm text-gray-900 mb-2">
                {item.item}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => actualizarChecklist(index, 'estado', 'bueno')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${item.estado === 'bueno'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  Bueno
                </button>
                <button
                  onClick={() => actualizarChecklist(index, 'estado', 'regular')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${item.estado === 'regular'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  Regular
                </button>
                <button
                  onClick={() => actualizarChecklist(index, 'estado', 'malo')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${item.estado === 'malo'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  Malo
                </button>
              </div>
              {item.estado !== 'bueno' && (
                <input
                  type="text"
                  placeholder="Observaciones..."
                  value={item.observacion || ''}
                  onChange={(e) => actualizarChecklist(index, 'observacion', e.target.value)}
                  className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sección 6: Observaciones y Configuración */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Observaciones y Configuración
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observaciones del Cliente
            </label>
            <textarea
              value={observacionesCliente}
              onChange={(e) => setObservacionesCliente(e.target.value)}
              rows={3}
              placeholder="Comentarios o solicitudes especiales del cliente..."
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observaciones del Mecánico
            </label>
            <textarea
              value={observacionesMecanico}
              onChange={(e) => setObservacionesMecanico(e.target.value)}
              rows={3}
              placeholder="Notas técnicas o hallazgos durante la inspección..."
              className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d0f12] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta_debito">Tarjeta de débito</option>
                <option value="tarjeta_credito">Tarjeta de crédito</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarDesglose}
                  onChange={(e) => setMostrarDesglose(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-white-900">
                    Mostrar desglose de repuestos en la nota
                  </div>
                  <div className="text-xs text-gray-500">
                    Por defecto solo se muestra el total del servicio
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 7: Resumen de Costos */}
      <div className="bg-[#1a1d24] rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Resumen de Costos
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white-600">Mano de Obra:</span>
            <span className="font-medium text-gray-900">
              ${subtotalManoObra.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white-600">Repuestos:</span>
            <span className="font-medium text-gray-900">
              ${subtotalRepuestos.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
            <span className="text-white-600">Subtotal:</span>
            <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white-600">IVA (16%):</span>
            <span className="font-medium text-gray-900">${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-3">
            <span className="text-white-900">Total:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Botón fijo inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1d24] border-t border-gray-200 p-4 shadow-lg md:left-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-white-600">
            Total de la orden: <span className="text-xl font-bold text-blue-600 ml-2">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/ordenes')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardarOrden}
              disabled={loading || !clienteSeleccionado || !motoSeleccionada}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Guardando...' : 'Guardar Orden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}