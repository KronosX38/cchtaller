// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-[var(--color-naranja)] hover:bg-[var(--color-naranja-dark)] text-white shadow-[var(--shadow-premium)]',
      secondary: 'bg-[var(--color-premium-800)] hover:bg-[var(--color-premium-700)] text-white border-2 border-[var(--color-premium-700)]',
      ghost: 'bg-transparent hover:bg-[var(--color-premium-800)] text-[var(--color-premium-100)]',
      danger: 'bg-[var(--color-error)] hover:bg-red-600 text-white shadow-[var(--shadow-premium)]'
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-3 text-base',
      lg: 'px-7 py-4 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button