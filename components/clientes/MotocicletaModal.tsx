// components/clientes/MotocicletaModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { X } from 'lucide-react'

interface MotocicletaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clienteId: string
  clienteNombre: string
  motocicletaId?: string
}

interface Marca {
  id: string
  nombre: string
}

export default function MotocicletaModal({
  isOpen,
  onClose,
  onSuccess,
  clienteId,
  clienteNombre,
  motocicletaId,
}: MotocicletaModalProps) {
  const [loading, setLoading] = useState(false)
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [formData, setFormData] = useState({
    marca: '',
    marcaOtra: '',
    modelo: '',
    year: '',
    placa: '',
    color: '',
    numeroSerie: '',
    cilindrada: '',
    kilometraje: '',
    notas: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch('/api/catalogos?tipo=marca_moto')
        const data = await response.json()
        setMarcas(data)
      } catch (error) {
        console.error('Error al cargar marcas:', error)
      }
    }

    fetchMarcas()
  }, [])

  useEffect(() => {
    if (isOpen) {
      if (motocicletaId) {
        fetchMotocicleta()
      } else {
        resetForm()
      }
    }
  }, [isOpen, motocicletaId])

  const fetchMotocicleta = async () => {
    try {
      const response = await fetch(`/api/motocicletas/${motocicletaId}`)
      const data = await response.json()

      // Verificar si la marca está en la lista
      const marcaEnLista = marcas.find(m => m.nombre.toUpperCase() === data.marca?.toUpperCase())

      setFormData({
        marca: marcaEnLista ? marcaEnLista.nombre : 'OTRA',
        marcaOtra: marcaEnLista ? '' : data.marca || '',
        modelo: data.modelo || '',
        year: data.year?.toString() || '',
        placa: data.placa || '',
        color: data.color || '',
        numeroSerie: data.numeroSerie || '',
        cilindrada: data.cilindrada || '',
        kilometraje: data.kilometraje?.toString() || '',
        notas: data.notas || '',
      })
    } catch (error) {
      console.error('Error al cargar motocicleta:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      marca: '',
      marcaOtra: '',
      modelo: '',
      year: '',
      placa: '',
      color: '',
      numeroSerie: '',
      cilindrada: '',
      kilometraje: '',
      notas: '',
    })
    setErrors({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.marca) {
      newErrors.marca = 'Selecciona una marca'
    }

    if (formData.marca === 'OTRA' && !formData.marcaOtra.trim()) {
      newErrors.marcaOtra = 'Especifica la marca'
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es obligatorio'
    }

    if (formData.year && (parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1)) {
      newErrors.year = 'Año inválido'
    }

    if (formData.kilometraje && parseInt(formData.kilometraje) < 0) {
      newErrors.kilometraje = 'El kilometraje no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const url = motocicletaId
        ? `/api/motocicletas/${motocicletaId}`
        : '/api/motocicletas'
      const method = motocicletaId ? 'PUT' : 'POST'

      const marcaFinal = formData.marca === 'OTRA' ? formData.marcaOtra : formData.marca

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: marcaFinal,
          modelo: formData.modelo,
          year: formData.year || null,
          placa: formData.placa || null,
          color: formData.color || null,
          numeroSerie: formData.numeroSerie || null,
          cilindrada: formData.cilindrada || null,
          kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null,
          notas: formData.notas || null,
          clienteId,
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert('Error al guardar motocicleta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar motocicleta')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white">
                {motocicletaId ? 'Editar Motocicleta' : 'Nueva Motocicleta'}
              </h2>
              <p className="text-sm text-[var(--color-premium-400)] mt-1">
                Cliente: {clienteNombre}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-premium-800)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-premium-400)]" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Marca */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-[var(--color-premium-300)] mb-2 uppercase tracking-wide">
                Marca <span className="text-[var(--color-naranja)]">*</span>
              </label>
              <select
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value, marcaOtra: '' })}
                className="w-full px-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg text-white focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20 transition-all"
                required
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.nombre}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
              {errors.marca && (
                <p className="mt-2 text-sm text-[var(--color-error)]">{errors.marca}</p>
              )}
            </div>

            {/* Campo "Otra marca" */}
            {formData.marca === 'OTRA' && (
              <Input
                label="Especifica la marca"
                placeholder="Ingresa la marca"
                value={formData.marcaOtra}
                onChange={(e) => setFormData({ ...formData, marcaOtra: e.target.value })}
                error={errors.marcaOtra}
                required
              />
            )}

            {/* Modelo */}
            <Input
              label="Modelo"
              placeholder="R15, CBR 250R, Ninja 400..."
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              error={errors.modelo}
              required
            />

            {/* Año, Placa, Color */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Input
                label="Año"
                type="number"
                placeholder="2023"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                error={errors.year}
              />

              <Input
                label="Placa"
                placeholder="YUC-1234"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
              />

              <Input
                label="Color"
                placeholder="Azul, Rojo..."
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            {/* Número de Serie, Cilindrada, Kilometraje */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Input
                label="Número de Serie (VIN)"
                placeholder="JH2RC7012NK123456"
                value={formData.numeroSerie}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value.toUpperCase() })}
              />

              <Input
                label="Cilindrada"
                placeholder="150cc, 250cc..."
                value={formData.cilindrada}
                onChange={(e) => setFormData({ ...formData, cilindrada: e.target.value })}
              />

              <Input
                label="Kilometraje"
                type="number"
                placeholder="15000"
                value={formData.kilometraje}
                onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                error={errors.kilometraje}
              />
            </div>

            {/* Notas */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-[var(--color-premium-400)] mb-2 uppercase tracking-wide">
                Notas (Opcional)
              </label>
              <textarea
                placeholder="Observaciones, modificaciones, detalles especiales..."
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
                {loading
                  ? 'Guardando...'
                  : motocicletaId
                  ? 'Actualizar Motocicleta'
                  : 'Agregar Motocicleta'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}