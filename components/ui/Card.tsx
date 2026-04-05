// components/ui/Card.tsx
import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-premium-900)] border-2 border-[var(--color-premium-800)] rounded-xl p-6',
        'shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-lg)] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3 className={cn('text-xl font-bold text-white', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('text-[var(--color-premium-300)]', className)} {...props}>
      {children}
    </div>
  )
}