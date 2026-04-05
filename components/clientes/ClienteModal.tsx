// components/clientes/ClienteModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { X } from 'lucide-react'

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clienteId?: string
}

interface Sucursal {
  id: string
  nombre: string
}

export default function ClienteModal({ isOpen, onClose, onSuccess, clienteId }: ClienteModalProps) {
  const [loading, setLoading] = useState(false)
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: '',
    sucursalId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar sucursales
  useEffect(() => {
    if (isOpen) {
      fetchSucursales()
      if (clienteId) {
        fetchCliente()
      } else {
        resetForm()
      }
    }
  }, [isOpen, clienteId])

  const fetchSucursales = async () => {
    try {
      const response = await fetch('/api/sucursales')
      const data = await response.json()
      setSucursales(data)
      if (data.length > 0 && !clienteId) {
        setFormData(prev => ({ ...prev, sucursalId: data[0].id }))
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error)
    }
  }

  const fetchCliente = async () => {
    try {
      const response = await fetch(`/api/clientes/${clienteId}`)
      const data = await response.json()
      setFormData({
      nombre: data.nombre || '',
      telefono: data.telefono || '',
      email: data.email || '',
      direccion: data.direccion || '',
      notas: data.notas || '',
      sucursalId: data.sucursalId || '',
      })
    } catch (error) {
      console.error('Error al cargar cliente:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      notas: '',
      sucursalId: sucursales[0]?.id || '',
    })
    setErrors({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.sucursalId) {
      newErrors.sucursalId = 'Selecciona una sucursal'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const url = clienteId ? `/api/clientes/${clienteId}` : '/api/clientes'
      const method = clienteId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert('Error al guardar cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar cliente')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              {clienteId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-premium-400)]" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {/* Nombre */}
            <Input
              label="Nombre Completo"
              placeholder="Juan Pérez García"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              error={errors.nombre}
              required
            />

            {/* Teléfono */}
            <Input
              label="Teléfono"
              type="tel"
              placeholder="9991234567"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              error={errors.telefono}
              required
            />

            {/* Email */}
            <Input
              label="Email (Opcional)"
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            {/* Dirección */}
            <Input
              label="Dirección (Opcional)"
              placeholder="Calle 45 #123, Colonia Centro"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />

            {/* Sucursal */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-[var(--color-premium-300)] mb-2 uppercase tracking-wide">
                Sucursal <span className="text-[var(--color-naranja)]">*</span>
              </label>
              <select
                value={formData.sucursalId}
                onChange={(e) => setFormData({ ...formData, sucursalId: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg text-white focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20 transition-all"
                required
              >
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
              {errors.sucursalId && (
                <p className="mt-2 text-sm text-[var(--color-error)]">{errors.sucursalId}</p>
              )}
            </div>

            {/* Notas */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-[var(--color-premium-300)] mb-2 uppercase tracking-wide">
                Notas (Opcional)
              </label>
              <textarea
                placeholder="Preferencias del cliente, observaciones, etc."
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg text-white placeholder:text-[var(--color-premium-500)] focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20 transition-all resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onClose}
                className="w-full lg:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full lg:flex-1"
              >
                {loading ? 'Guardando...' : clienteId ? 'Actualizar Cliente' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}