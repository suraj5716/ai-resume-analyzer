export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50'

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
