// app/(dashboard)/ordenes/nueva/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle, Search, X } from 'lucide-react'


interface Cliente {
  id: string
  nombre: string
  telefono: string
  email?: string
  direccion?: string
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
  }
  marcaManual?: string
  modeloManual?: string
  placa?: string
  year?: number
  color?: string
  kilometraje?: number
}

interface Mecanico {
  id: string
  nombre: string
}

interface Producto {
  id: string
  nombre: string
  codigo?: string
  stockActual: number
  precioCompra: number | any
  precioVenta: number | any
}

interface ServicioManoObra {
  id: string
  nombre: string
  categoria: string
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

// Función para formatear dinero
const formatearDinero = (cantidad: number): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cantidad)
}


export default function NuevaOrdenPage() {
  const router = useRouter()
  const firmaRecepcionClienteRef = useRef<HTMLCanvasElement>(null)
  const firmaRecepcionTallerRef = useRef<HTMLCanvasElement>(null)

  // Estados
  const [empleadoRecepcionId, setEmpleadoRecepcionId] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [motoSeleccionada, setMotoSeleccionada] = useState<Motocicleta | null>(null)
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [serviciosManoObra, setServiciosManoObra] = useState<ServicioManoObra[]>([])

  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [mostrarClientes, setMostrarClientes] = useState(false)
  const [busquedaServicio, setBusquedaServicio] = useState('')
  const [mostrarServicios, setMostrarServicios] = useState(false)
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [mostrarProductos, setMostrarProductos] = useState(false)

  const [numeroOrden, setNumeroOrden] = useState('')
  const [tipoServicio, setTipoServicio] = useState('mantenimiento_preventivo')
  const [mecanicoId, setMecanicoId] = useState('')
  const [kilometrajeEntrada, setKilometrajeEntrada] = useState('')
  const [nivelCombustible, setNivelCombustible] = useState('medio')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [observacionesCliente, setObservacionesCliente] = useState('')
  const [observacionesMecanico, setObservacionesMecanico] = useState('')
  const [numeroServicioCliente, setNumeroServicioCliente] = useState<number>(0)

  const [detalles, setDetalles] = useState<DetalleServicio[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [checklist, setChecklist] = useState<ItemChecklist[]>(
    ITEMS_CHECKLIST.map(item => ({ item, estado: 'bueno', observacion: '' }))
  )

  const [dibujandoCliente, setDibujandoCliente] = useState(false)
  const [dibujandoTaller, setDibujandoTaller] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar datos y generar número de orden
  useEffect(() => {
    cargarDatos()
    generarNumeroOrden()
  }, [])

  const obtenerNumeroServicioCliente = async (clienteId: string) => {
    try {
      const res = await fetch(`/api/ordenes?clienteId=${clienteId}`)
      if (res.ok) {
        const ordenes = await res.json()
        setNumeroServicioCliente(ordenes.length + 1)
      } else {
        setNumeroServicioCliente(1)
      }
    } catch (error) {
      console.error('Error al obtener servicios del cliente:', error)
      setNumeroServicioCliente(1)
    }
  }

  const cargarDatos = async () => {
    try {
      const [resClientes, resMecanicos, resProductos, resServicios] = await Promise.all([
        fetch('/api/clientes?activo=true'),
        fetch('/api/mecanicos'),
        fetch('/api/productos'),
        fetch('/api/servicios-mano-obra'),
      ])

      if (resClientes.ok) setClientes(await resClientes.json())
      if (resMecanicos.ok) setMecanicos(await resMecanicos.json())
      if (resProductos.ok) setProductos(await resProductos.json())
      if (resServicios.ok) setServiciosManoObra(await resServicios.json())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const generarNumeroOrden = async () => {
    try {
      const res = await fetch('/api/ordenes')
      if (res.ok) {
        const ordenes = await res.json()
        const ultimoNumero = ordenes.length > 0
          ? parseInt(ordenes[0].numero)
          : 0
        setNumeroOrden((ultimoNumero + 1).toString().padStart(4, '0'))
      } else {
        setNumeroOrden('0001')
      }
    } catch (error) {
      setNumeroOrden('0001')
    }
  }

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

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setBusquedaCliente(cliente.nombre)
    setMostrarClientes(false)

    obtenerNumeroServicioCliente(cliente.id)

    if (cliente.motocicletas?.length === 1) {
      const moto = cliente.motocicletas[0]
      setMotoSeleccionada(moto)
      if (moto.kilometraje) setKilometrajeEntrada(moto.kilometraje.toString())
    }
  }

  const calcularPrecioServicio = (servicio: ServicioManoObra): number => {
    if (!motoSeleccionada?.modeloMoto?.categoria) {
      return servicio.precioUrbana * (1 + servicio.aumentoAnual)
    }

    const categoria = motoSeleccionada.modeloMoto.categoria
    let precioBase = servicio.precioUrbana

    switch (categoria) {
      case 'semiautomatica': precioBase = servicio.precioSemiautomatica; break
      case 'motoneta': precioBase = servicio.precioMontoneta; break
      case 'urbana': precioBase = servicio.precioUrbana; break
      case 'urbana_grande': precioBase = servicio.precioUrbanaGrande; break
      case 'trabajo': precioBase = servicio.precioTrabajo; break
    }

    return precioBase * (1 + servicio.aumentoAnual)
  }

  const agregarServicio = (servicio: ServicioManoObra) => {
    const precio = calcularPrecioServicio(servicio)
    setDetalles([...detalles, {
      servicioManoObraId: servicio.id,
      descripcion: servicio.nombre,
      cantidad: 1,
      precioUnitario: precio,
      subtotal: precio,
    }])
    setMostrarServicios(false)
    setBusquedaServicio('')
  }

  const agregarRepuesto = (producto: Producto) => {
    const precioVenta = parseFloat(producto.precioVenta.toString())
    const precioCompra = parseFloat(producto.precioCompra.toString())

    setRepuestos([...repuestos, {
      productoId: producto.id,
      nombre: producto.nombre,
      descripcion: producto.nombre,
      cantidad: 1,
      precioCompra,
      precioVenta,
      subtotal: precioVenta,
    }])
    setMostrarProductos(false)
    setBusquedaProducto('')
  }

  const eliminarServicio = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const eliminarRepuesto = (index: number) => {
    setRepuestos(repuestos.filter((_, i) => i !== index))
  }

  const calcularTotales = () => {
    const subtotalManoObra = detalles.reduce((sum, d) => sum + d.subtotal, 0)
    const subtotalRepuestos = repuestos.reduce((sum, r) => sum + r.subtotal, 0)
    const subtotal = subtotalManoObra + subtotalRepuestos
    const iva = subtotal * 0.16
    const total = subtotal + iva

    return { subtotalManoObra, subtotalRepuestos, subtotal, iva, total }
  }

  // Funciones de firma (canvas)
  const iniciarDibujo = (e: React.MouseEvent<HTMLCanvasElement>, tipo: 'cliente' | 'taller') => {
    const canvas = tipo === 'cliente' ? firmaRecepcionClienteRef.current : firmaRecepcionTallerRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)

    if (tipo === 'cliente') setDibujandoCliente(true)
    else setDibujandoTaller(true)
  }

  const dibujar = (e: React.MouseEvent<HTMLCanvasElement>, tipo: 'cliente' | 'taller') => {
    const dibujando = tipo === 'cliente' ? dibujandoCliente : dibujandoTaller
    if (!dibujando) return

    const canvas = tipo === 'cliente' ? firmaRecepcionClienteRef.current : firmaRecepcionTallerRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const detenerDibujo = () => {
    setDibujandoCliente(false)
    setDibujandoTaller(false)
  }

  const limpiarFirma = (tipo: 'cliente' | 'taller') => {
    const canvas = tipo === 'cliente' ? firmaRecepcionClienteRef.current : firmaRecepcionTallerRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const guardarOrden = async () => {
    if (!clienteSeleccionado || !motoSeleccionada) {
      setError('Debes seleccionar un cliente y una motocicleta')
      return
    }

    setLoading(true)
    setError('')

    try {
      const firmaCliente = firmaRecepcionClienteRef.current?.toDataURL() || null
      const firmaTaller = firmaRecepcionTallerRef.current?.toDataURL() || null

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
          mostrarDesglose: false,
          firmaRecepcion: firmaCliente,
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

  const totales = calcularTotales()

  return (
    <div className="min-h-screen bg-[#0d0f12] py-4 px-2 sm:py-8 sm:px-12">
      {/* Botones superiores - RESPONSIVE */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <button
          onClick={() => router.push('/ordenes')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <button
          onClick={guardarOrden}
          disabled={loading || !clienteSeleccionado || !motoSeleccionada}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Orden'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* HOJA DE ORDEN - RESPONSIVE */}
      <div className="max-w-4xl mx-auto bg-gray shadow-2xl">
        {/* ENCABEZADO - RESPONSIVE */}
        <div className="border-b-4 border-black p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* Ícono naranja */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#e85a2b' }}>
                <img
                  src="/cch_logo.svg"
                  alt="CCH Taller Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#e85a2b' }}>CCH Taller</div>
                <div className="text-xs text-gray-600">Sistema CRM</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#e85a2b' }}>
                HOJA DE RECEPCIÓN
              </h1>
              <div className="text-sm mt-1">
                <span className="font-semibold">ORDEN DE SERVICIO</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold mt-1" style={{ color: '#e85a2b' }}>
                N° {numeroOrden}
              </div>
              {clienteSeleccionado && numeroServicioCliente > 0 && (
                <div className="text-sm mt-2">
                  <span className="font-semibold" style={{ color: '#C5A02F' }}>
                    Servicio #{numeroServicioCliente}
                  </span>
                  <span className="text-gray-600"> del cliente</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
            <div>
              <span className="font-semibold">Fecha:</span>{' '}
              <span className="border-b border-gray-400 px-2">
                {new Date().toLocaleDateString('es-MX')}
              </span>
            </div>
            <div>
              <span className="font-semibold">Hora:</span>{' '}
              <span className="border-b border-gray-400 px-2">
                {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* DATOS DEL CLIENTE - RESPONSIVE: 1 col móvil, 2 col tablet+ */}
        <div className="border-b-2 border-gray-300 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {/* Búsqueda de cliente */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold w-20 sm:w-24" style={{ color: '#56C5F5' }}>Nombre:</span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={busquedaCliente}
                    onChange={(e) => {
                      setBusquedaCliente(e.target.value)
                      setMostrarClientes(true)
                    }}
                    onFocus={() => setMostrarClientes(true)}
                    className="w-full border-b border-gray-400 px-1 py-1 focus:outline-none focus:border-blue-500 text-white-900 placeholder-gray-400"
                  />

                  {mostrarClientes && busquedaCliente && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                      {clientesFiltrados.length === 0 ? (
                        <div className="p-2 text-xs text-gray-500">No se encontraron clientes</div>
                      ) : (
                        clientesFiltrados.map(c => (
                          <button
                            key={c.id}
                            onClick={() => seleccionarCliente(c)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-xs border-b last:border-0"
                          >
                            <div className="font-medium text-gray-900">{c.nombre}</div>
                            <div className="text-gray-600">{c.telefono}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold w-20 sm:w-24" style={{ color: '#56C5F5' }}>Teléfono:</span>
              <input
                type="text"
                value={clienteSeleccionado?.telefono || ''}
                readOnly
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-transparent text-white-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold w-20 sm:w-24" style={{ color: '#56C5F5' }}>Dirección:</span>
              <input
                type="text"
                value={clienteSeleccionado?.direccion || ''}
                readOnly
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-transparent text-white-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold w-20 sm:w-24" style={{ color: '#56C5F5' }}>E-mail:</span>
              <input
                type="text"
                value={clienteSeleccionado?.email || ''}
                readOnly
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-transparent text-white-900"
              />
            </div>
          </div>
        </div>

        {/* TIPO DE SERVICIO - RESPONSIVE */}
        <div className="border-b-2 border-gray-300 p-4">
          <h2 className="font-bold text-center mb-3" style={{ color: '#e85a2b' }}>
            TIPO DE SERVICIO
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { value: 'mantenimiento_preventivo', label: 'a) Mantenimiento Preventivo' },
              { value: 'reparacion_electrica', label: 'c) Reparación Eléctrica' },
              { value: 'reparacion_general', label: 'b) Reparación General' },
              { value: 'diagnostico', label: 'd) Diagnóstico' },
            ].map(tipo => (
              <label key={tipo.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoServicio"
                  value={tipo.value}
                  checked={tipoServicio === tipo.value}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{tipo.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* INVENTARIO DE LA UNIDAD - RESPONSIVE */}
        <div className="border-b-2 border-gray-300 p-4">
          <h2 className="font-bold text-center mb-3" style={{ color: '#e85a2b' }}>
            INVENTARIO DE LA UNIDAD
          </h2>

          {/* Datos de la moto - RESPONSIVE: 1 col móvil, 3 col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: '#56C5F5' }}>Modelo:</span>
              <select
                value={motoSeleccionada?.id || ''}
                onChange={(e) => {
                  const moto = clienteSeleccionado?.motocicletas?.find(m => m.id === e.target.value)
                  if (moto) {
                    setMotoSeleccionada(moto)
                    if (moto.kilometraje) setKilometrajeEntrada(moto.kilometraje.toString())
                  }
                }}
                disabled={!clienteSeleccionado}
                className="flex-1 border-b border-gray-400 px-1 py-1 text-xs bg-white text-gray-900 disabled:bg-gray-100"
              >
                <option value="" className="text-gray-400">Seleccionar...</option>
                {clienteSeleccionado?.motocicletas?.map(m => (
                  <option key={m.id} value={m.id} className="text-gray-900">
                    {m.modeloMoto
                      ? `${m.modeloMoto.marca.nombre} ${m.modeloMoto.nombre}`
                      : `${m.marcaManual} ${m.modeloManual}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: '#56C5F5' }}>Año:</span>
              <input
                type="text"
                value={motoSeleccionada?.year || ''}
                readOnly
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-transparent text-xs text-white-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: '#56C5F5' }}>Placa:</span>
              <input
                type="text"
                value={motoSeleccionada?.placa || ''}
                readOnly
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-transparent text-xs text-white-900"
              />
            </div>
            {/* IMAGENES MOTOS */}
            <div className="col-span-full mt-3 flex justify-center gap-4 py-2 border-t border-gray-200">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Scooter</div>
                <div className="w-12 h-12 bg-gray-100 rounded">
                  {/* Tu SVG aquí */}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Scooter</div>
                <div className="w-12 h-12 bg-gray-100 rounded">
                  {/* Tu SVG aquí */}
                </div>

              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Scooter</div>
                <div className="w-12 h-12 bg-gray-100 rounded">
                  {/* Tu SVG aquí */}
                </div>

              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Scooter</div>
                <div className="w-12 h-12 bg-gray-100 rounded">
                  {/* Tu SVG aquí */}
                </div>
              </div>
            </div>


          </div>

          {/* Checklist - RESPONSIVE: 1 col móvil, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {checklist.map((item, index) => (
              <div key={index} className="text-xs border border-gray-300 p-1 bg-gray">
                <div className="font-semibold mb-1" style={{ color: '#56C5F5' }}>
                  {item.item}
                </div>
                <div className="flex gap-1">
                  {['bueno', 'regular', 'malo'].map(estado => (
                    <label key={estado} className="flex items-center gap-0.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`checklist-${index}`}
                        checked={item.estado === estado}
                        onChange={() => {
                          const nuevo = [...checklist]
                          nuevo[index].estado = estado
                          setChecklist(nuevo)
                        }}
                        className="w-3 h-3"
                      />
                      <span className="text-[10px] text-white-900">
                        {estado === 'bueno' ? 'B' : estado === 'regular' ? 'R' : 'M'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Medidor de Combustible - RESPONSIVE */}
          <div className="mb-4">
            <div className="font-semibold text-sm mb-2" style={{ color: '#C5A02F' }}>
              Nivel de Combustible
            </div>

            <div className="relative">
              <div
                className="h-10 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ff4444 0%, #ffaa00 25%, #ffff00 50%, #88ff00 75%, #00ff00 100%)'
                }}
              />

              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={
                  nivelCombustible === 'vacio' ? 0 :
                    nivelCombustible === 'cuarto' ? 1 :
                      nivelCombustible === 'medio' ? 2 :
                        nivelCombustible === 'tres_cuartos' ? 3 : 4
                }
                onChange={(e) => {
                  const valor = parseInt(e.target.value)
                  setNivelCombustible(
                    valor === 0 ? 'vacio' :
                      valor === 1 ? 'cuarto' :
                        valor === 2 ? 'medio' :
                          valor === 3 ? 'tres_cuartos' : 'lleno'
                  )
                }}
                className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer"
                style={{ zIndex: 10 }}
              />

              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200 pointer-events-none"
                style={{
                  left: nivelCombustible === 'vacio' ? '10%' :
                    nivelCombustible === 'cuarto' ? '30%' :
                      nivelCombustible === 'medio' ? '50%' :
                        nivelCombustible === 'tres_cuartos' ? '70%' : '90%',
                  zIndex: 5
                }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs mt-2 px-1 sm:px-2">
              <span className="text-gray-600 font-medium">E</span>
              <span className="text-gray-600">1/4</span>
              <span className="text-gray-600">1/2</span>
              <span className="text-gray-600">3/4</span>
              <span className="text-gray-600 font-medium">F</span>
            </div>
          </div>

          {/* Kilometraje - RESPONSIVE */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            <span className="font-semibold text-sm" style={{ color: '#56C5F5' }}>Kilometraje de Entrada:</span>
            <input
              type="number"
              value={kilometrajeEntrada}
              onChange={(e) => setKilometrajeEntrada(e.target.value)}
              className="w-full sm:w-32 border-b border-gray-400 px-1 py-1 text-white-900"
            />
          </div>
        </div>

        {/* TÉCNICO Y OBSERVACIONES - RESPONSIVE */}
        <div className="border-b-2 border-gray-300 p-4">
          <h2 className="font-bold text-center mb-3" style={{ color: '#C5A02F' }}>
            TÉCNICO Y OBSERVACIONES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <span className="font-semibold" style={{ color: '#56C5F5' }}>Técnico Recep.:</span>
              <select
                value={mecanicoId}
                onChange={(e) => setMecanicoId(e.target.value)}
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-white text-xs text-gray-900"
              >
                <option value="" className="text-gray-400">Sin asignar</option>
                {mecanicos.map(m => (
                  <option key={m.id} value={m.id} className="text-gray-900">{m.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <span className="font-semibold" style={{ color: '#56C5F5' }}>Método de Pago:</span>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="flex-1 border-b border-gray-400 px-1 py-1 bg-white text-xs text-gray-900"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta_debito">Tarjeta débito</option>
                <option value="tarjeta_credito">Tarjeta crédito</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <div className="font-semibold text-sm mb-1" style={{ color: '#56C5F5' }}>
              Comentarios del Cliente:
            </div>
            <textarea
              value={observacionesCliente}
              onChange={(e) => setObservacionesCliente(e.target.value)}
              rows={2}
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm resize-none text-white-900 placeholder-gray-400"
              placeholder="Observaciones o solicitudes del cliente..."
            />
          </div>

          <div>
            <div className="font-semibold text-sm mb-1" style={{ color: '#56C5F5' }}>
              Observaciones del Técnico:
            </div>
            <textarea
              value={observacionesMecanico}
              onChange={(e) => setObservacionesMecanico(e.target.value)}
              rows={2}
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm resize-none text-white-900 placeholder-gray-400"
              placeholder="Notas técnicas o hallazgos..."
            />
          </div>
        </div>

        {/* SERVICIOS Y REPUESTOS - RESPONSIVE: stack vertical en móvil */}
        <div className="border-b-2 border-gray-300 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Servicios */}
            <div>
              <div className="font-semibold text-sm mb-2 flex items-center justify-between">
                <span style={{ color: '#C5A02F' }}>Trabajos:</span>
                <button
                  onClick={() => setMostrarServicios(!mostrarServicios)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  {mostrarServicios ? 'Cerrar' : 'Buscar'}
                </button>
              </div>

              {mostrarServicios && (
                <div className="mb-2 relative">
                  <input
                    type="text"
                    placeholder="Buscar servicio..."
                    value={busquedaServicio}
                    onChange={(e) => setBusquedaServicio(e.target.value)}
                    className="w-full text-xs border border-gray-400 rounded px-2 py-1 text-white-900 placeholder-gray-400"
                  />
                  {busquedaServicio && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-32 overflow-auto">
                      {serviciosFiltrados.length === 0 ? (
                        <div className="p-2 text-xs text-gray-500">No se encontraron servicios</div>
                      ) : (
                        serviciosFiltrados.map(s => {
                          const precio = calcularPrecioServicio(s)
                          return (
                            <button
                              key={s.id}
                              onClick={() => agregarServicio(s)}
                              className="w-full text-left px-2 py-1 hover:bg-gray-100 text-xs border-b last:border-0"
                            >
                              <div className="font-medium text-gray-900">{s.nombre}</div>
                              <div className="text-gray-600">${formatearDinero(precio)}</div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {detalles.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1 rounded" style={{ background: '#e4c5bb' }}>
                    <span className="flex-1 truncate" style={{ color: '#131313' }}>{d.descripcion}</span>
                    <span className="font-semibold ml-2" style={{ color: '#e85a2b' }}>${formatearDinero(d.subtotal)}</span>
                    <button
                      onClick={() => eliminarServicio(i)}
                      className="ml-1 text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {detalles.length === 0 && (
                  <div className="text-xs text-gray-400 italic">Sin trabajos</div>
                )}
              </div>
            </div>

            {/* Repuestos */}
            <div>
              <div className="font-semibold text-sm mb-2 flex items-center justify-between">
                <span style={{ color: '#56C5F5' }}>Repuestos:</span>
                <button
                  onClick={() => setMostrarProductos(!mostrarProductos)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  {mostrarProductos ? 'Cerrar' : 'Buscar'}
                </button>
              </div>

              {mostrarProductos && (
                <div className="mb-2 relative">
                  <input
                    type="text"
                    placeholder="Buscar repuesto..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    className="w-full text-xs border border-gray-400 rounded px-2 py-1 text-white-900 placeholder-gray-400"
                  />
                  {busquedaProducto && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-32 overflow-auto">
                      {productosFiltrados.length === 0 ? (
                        <div className="p-2 text-xs text-gray-500">No se encontraron productos</div>
                      ) : (
                        productosFiltrados.map(p => (
                          <button
                            key={p.id}
                            onClick={() => agregarRepuesto(p)}
                            className="w-full text-left px-2 py-1 hover:bg-gray-100 text-xs border-b last:border-0"
                          >
                            <div className="font-medium text-gray-900">{p.nombre}</div>
                            <div className="text-gray-600">
                              ${formatearDinero(parseFloat(p.precioVenta.toString()))} • Stock: {p.stockActual}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {repuestos.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1 rounded" style={{ background: '#e4c5bb' }}>
                    <span className="flex-1 truncate" style={{ color: '#131313' }}>{r.nombre} (x{r.cantidad})</span>
                    <span className="font-semibold ml-2" style={{ color: '#e85a2b' }}>${formatearDinero(r.subtotal)}</span>
                    <button
                      onClick={() => eliminarRepuesto(i)}
                      className="ml-1 text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {repuestos.length === 0 && (
                  <div className="text-xs text-gray-400 italic">Sin repuestos</div>
                )}
              </div>
            </div>
          </div>

          {/* Totales */}
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex justify-end">
              <div className="space-y-1 min-w-[200px]">
                <div className="flex justify-between gap-4 text-sm">
                  <span style={{ color: '#56C5F5' }}>Subtotal:</span>
                  <span className="font-semibold text-white-900">${formatearDinero(totales.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span style={{ color: '#56C5F5' }}>IVA (16%):</span>
                  <span className="font-semibold text-white-900">${formatearDinero(totales.iva)}</span>
                </div>
                <div className="flex justify-between gap-4 text-base border-t border-gray-400 pt-1">
                  <span className="font-bold" style={{ color: '#C5A02F' }}>TOTAL:</span>
                  <span className="font-bold" style={{ color: '#e85a2b' }}>
                    ${formatearDinero(totales.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIRMAS DE RECEPCIÓN - RESPONSIVE: 1 col móvil, 2 col tablet+ */}
        <div className="p-4">
          <h3 className="font-bold text-center mb-4" style={{ color: '#e85a2b' }}>
            FIRMAS DE RECEPCIÓN
          </h3>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-center mb-2 font-semibold text-sm" style={{ color: '#56C5F5' }}>
                Nombre y firma del Cliente
              </div>
              <div className="border-2 border-gray-400 rounded overflow-hidden">
                <canvas
                  ref={firmaRecepcionClienteRef}
                  width={450}
                  height={100}
                  className="bg-white cursor-crosshair"
                  onMouseDown={(e) => iniciarDibujo(e, 'cliente')}
                  onMouseMove={(e) => dibujar(e, 'cliente')}
                  onMouseUp={detenerDibujo}
                  onMouseLeave={detenerDibujo}
                />
              </div>
              {/* NOMBRE AUTO-RELLENADO */}
              <div className="mt-2 text-center text-sm font-medium border-b border-gray-400 px-1 py-1" style={{ color: '#56C5F5' }}>
                {clienteSeleccionado?.nombre || '___________________________'}
              </div>
              <button
                onClick={() => limpiarFirma('cliente')}
                className="text-xs text-white-600 hover:underline mt-1 block mx-auto"
              >
                Limpiar firma
              </button>
            </div>

            <div>
              <div className="text-center mb-2 font-semibold text-sm" style={{ color: '#56C5F5' }}>
                Nombre y firma del Centro de Servicio
              </div>
              <div className="border-2 border-gray-400 rounded overflow-hidden">
                <canvas
                  ref={firmaRecepcionTallerRef}
                  width={450}
                  height={100}
                  className="bg-white cursor-crosshair w-full max-w-full"
                  style={{ height: '100px' }}
                  onMouseDown={(e) => iniciarDibujo(e, 'taller')}
                  onMouseMove={(e) => dibujar(e, 'taller')}
                  onMouseUp={detenerDibujo}
                  onMouseLeave={detenerDibujo}
                />
              </div>

              {/* SELECTOR DE EMPLEADO */}
              <select
                value={empleadoRecepcionId}
                onChange={(e) => setEmpleadoRecepcionId(e.target.value)}
                className="mt-2 w-full text-sm border-b border-gray-400 px-1 py-1 text-center " style={{ color: '#56C5F5' }}
              >
                <option style={{ background: '#030708' }} value="">Seleccionar empleado...</option>
                {mecanicos.map(m => (
                  <option style={{ background: '#030708' }} key={m.id} value={m.id} >{m.nombre}</option>
                ))}
              </select>
              <button
                onClick={() => limpiarFirma('taller')}
                className="text-xs text-white-600 hover:underline mt-1 block mx-auto"
              >
                Limpiar firma
              </button>
            </div>
          </div>

          {/* Términos */}
          <div className="mt-4 text-xs text-white-600 border-t border-gray-300 pt-3">
            <p className="font-semibold mb-1">ACEPTO QUE:</p>
            <p>1) Revisé las condiciones de mi motocicleta.</p>
            <p>2) Me explicaron las actividades realizadas en el servicio y/o reparación.</p>
            <p>3) Recibí información para el siguiente servicio preventivo de la motocicleta.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray p-3 text-center text-xs text-white-600 " >
          <p className="font-semibold">CCH Taller de motos</p>
          <p>Matriz: Calle 187-I 551 entre 104 y 106 • Fracc. Santa Cruz Palomeque</p>
          <p>Suc. Santa Cruz: (999) 162 65 94 • Suc. Caucel: (999) 140 47 55</p>
        </div>
      </div>

      {/* Botón guardar fijo - RESPONSIVE */}
      <div className="max-w-4xl mx-auto mt-4 mb-4 print:hidden">
        <button
          onClick={guardarOrden}
          disabled={loading || !clienteSeleccionado || !motoSeleccionada}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando orden...' : 'GUARDAR ORDEN DE SERVICIO'}
        </button>
      </div>
    </div>
  )
}
