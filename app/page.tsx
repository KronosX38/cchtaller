// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // TODO: Implementar autenticación real
    setTimeout(() => {
      if (email === 'admin@cchtaller.com' && password === 'admin123') {
        router.push('/dashboard')
      } else {
        setError('Credenciales incorrectas')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-premium-black)] via-[var(--color-premium-900)] to-[var(--color-premium-black)] p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[var(--color-naranja)] to-[var(--color-naranja-dark)] rounded-full mb-4 shadow-[var(--shadow-glow-naranja)] p-2">
            <img
              src="/cch_logo.svg"
              alt="CCH Taller Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            CCH Taller de Motos
          </h1>
          <p className="text-sm lg:text-base text-[var(--color-premium-400)]">Sistema de Gestión Integral</p>
        </div>

        {/* Card de Login */}
        <Card>
          <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
              <p className="text-[var(--color-premium-400)] text-sm">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <div className="bg-[var(--color-error)]/10 border-2 border-[var(--color-error)] rounded-lg p-3 lg:p-4">
                <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>
              </div>
            )}

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@cchtaller.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center">
              <a href="#" className="text-sm text-[var(--color-naranja)] hover:text-[var(--color-naranja-light)] transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-[var(--color-premium-500)] text-xs lg:text-sm mt-6 lg:mt-8">
          © 2026 CCH Taller de Motos. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}