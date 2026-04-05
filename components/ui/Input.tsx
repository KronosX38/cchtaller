// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-[var(--color-premium-300)] mb-2 uppercase tracking-wide">
            {label}
            {props.required && <span className="text-[var(--color-naranja)] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[var(--color-premium-800)] border-2 border-[var(--color-premium-700)] rounded-lg',
            'text-white placeholder:text-[var(--color-premium-500)]',
            'focus:outline-none focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20',
            'transition-all duration-200',
            error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input