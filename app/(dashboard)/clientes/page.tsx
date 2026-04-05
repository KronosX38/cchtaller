// app/(dashboard)/clientes/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ClienteModal from '@/components/clientes/ClienteModal'
import MotocicletaModal from '@/components/clientes/MotocicletaModal'
import { Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, Bike } from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  email?: string
  direccion?: string
  notas?: string
  sucursal: {
    nombre: string
  }
  motocicletas: {
    id: string
    marca: string
    modelo: string
    placa?: string
    year?: number
  }[]
  createdAt: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showMotoModal, setShowMotoModal] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<string | undefined>()
  const [selectedClienteNombre, setSelectedClienteNombre] = useState('')
  const [selectedMotoId, setSelectedMotoId] = useState<string | undefined>()

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clientes')
      const data = await response.json()
      if (Array.isArray(data)) {
        setClientes(data)
      } else {
        setClientes([])
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
      fetchClientes()
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
    }
  }

  const handleDeleteMoto = async (motoId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta motocicleta?')) return

    try {
      await fetch(`/api/motocicletas/${motoId}`, { method: 'DELETE' })
      fetchClientes()
    } catch (error) {
      console.error('Error al eliminar motocicleta:', error)
    }
  }

  const handleEditCliente = (id: string) => {
    setSelectedClienteId(id)
    setShowClienteModal(true)
  }

  const handleNewCliente = () => {
    setSelectedClienteId(undefined)
    setShowClienteModal(true)
  }

  const handleNewMoto = (clienteId: string, clienteNombre: string) => {
    setSelectedClienteId(clienteId)
    setSelectedClienteNombre(clienteNombre)
    setSelectedMotoId(undefined)
    setShowMotoModal(true)
  }

  const handleEditMoto = (clienteId: string, clienteNombre: string, motoId: string) => {
    setSelectedClienteId(clienteId)
    setSelectedClienteNombre(clienteNombre)
    setSelectedMotoId(motoId)
    setShowMotoModal(true)
  }

  const handleClienteModalClose = () => {
    setShowClienteModal(false)
    setSelectedClienteId(undefined)
  }

  const handleMotoModalClose = () => {
    setShowMotoModal(false)
    setSelectedClienteId(undefined)
    setSelectedClienteNombre('')
    setSelectedMotoId(undefined)
  }

  const handleSuccess = () => {
    fetchClientes()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-sm lg:text-base text-[var(--color-premium-400)]">
            Gestiona tu base de clientes
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleNewCliente}
          className="w-full lg:w-auto"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Búsqueda */}
      <Card>
        <div className="p-4 lg:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-premium-500)]" />
            <input
              type="search"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg text-white placeholder:text-[var(--color-premium-500)] focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20 transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Lista de Clientes */}
      {loading ? (
        <Card>
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--color-naranja)] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-[var(--color-premium-400)] mt-4">Cargando clientes...</p>
          </div>
        </Card>
      ) : clientesFiltrados.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-[var(--color-premium-400)] text-lg">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} className="hover:border-[var(--color-naranja)]/30 transition-all">
              <div className="p-4 lg:p-6">
                {/* Header del Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-1 truncate">
                      {cliente.nombre}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-[var(--color-naranja)]/10 text-[var(--color-naranja)] text-xs font-semibold rounded">
                      {cliente.sucursal.nombre}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEditCliente(cliente.id)}
                      className="p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-[var(--color-info)]" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                    </button>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[var(--color-premium-300)] text-sm">
                    <Phone className="w-4 h-4 text-[var(--color-naranja)] flex-shrink-0" />
                    <a href={`tel:${cliente.telefono}`} className="hover:text-[var(--color-naranja)] transition-colors">
                      {cliente.telefono}
                    </a>
                  </div>
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-[var(--color-premium-300)] text-sm">
                      <Mail className="w-4 h-4 text-[var(--color-naranja)] flex-shrink-0" />
                      <a href={`mailto:${cliente.email}`} className="hover:text-[var(--color-naranja)] transition-colors truncate">
                        {cliente.email}
                      </a>
                    </div>
                  )}
                  {cliente.direccion && (
                    <div className="flex items-start gap-2 text-[var(--color-premium-300)] text-sm">
                      <MapPin className="w-4 h-4 text-[var(--color-naranja)] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{cliente.direccion}</span>
                    </div>
                  )}
                </div>

                {/* Motocicletas */}
                <div className="border-t border-[var(--color-premium-800)] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[var(--color-premium-400)] text-xs font-semibold">
                      <Bike className="w-4 h-4" />
                      <span>MOTOCICLETAS ({cliente.motocicletas.length})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNewMoto(cliente.id, cliente.nombre)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar
                    </Button>
                  </div>

                  {cliente.motocicletas.length > 0 ? (
                    <div className="space-y-2">
                      {cliente.motocicletas.map((moto) => (
                        <div
                          key={moto.id}
                          className="flex items-center justify-between p-3 bg-[var(--color-premium-800)] rounded-lg hover:bg-[var(--color-premium-700)] transition-all group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                              {moto.marca} {moto.modelo}
                              {moto.year && (
                                <span className="text-[var(--color-premium-400)] ml-1">
                                  ({moto.year})
                                </span>
                              )}
                            </p>
                            {moto.placa && (
                              <p className="text-[var(--color-premium-400)] text-xs mt-0.5">
                                {moto.placa}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditMoto(cliente.id, cliente.nombre, moto.id)}
                              className="p-1.5 hover:bg-[var(--color-premium-900)] rounded transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-[var(--color-info)]" />
                            </button>
                            <button
                              onClick={() => handleDeleteMoto(moto.id)}
                              className="p-1.5 hover:bg-[var(--color-premium-900)] rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-[var(--color-error)]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--color-premium-500)] text-sm text-center py-4">
                      Sin motocicletas registradas
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Cliente */}
      <ClienteModal
        isOpen={showClienteModal}
        onClose={handleClienteModalClose}
        onSuccess={handleSuccess}
        clienteId={selectedClienteId}
      />

      {/* Modal Motocicleta */}
      {selectedClienteId && (
        <MotocicletaModal
          isOpen={showMotoModal}
          onClose={handleMotoModalClose}
          onSuccess={handleSuccess}
          clienteId={selectedClienteId}
          clienteNombre={selectedClienteNombre}
          motocicletaId={selectedMotoId}
        />
      )}
    </div>
  )
}