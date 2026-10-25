import { Link } from 'react-router-dom'

const variants = {
  primary: 'btn-ticket',
  outline: 'btn-outline',
  subtle: 'rounded-full px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f0ebe3] transition-colors',
}

export default function Button({
  to,
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  disabled = false,
  ...props
}) {
  const classes = `${variants[variant] || variants.primary} ${className}`.trim()

  if (to && !disabled) {
    return <Link to={to} className={classes} {...props}>{children}</Link>
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  )
}
