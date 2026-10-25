const variants = {
  default: 'bg-[#f0ebe3] text-[#6b6b6b]',
  accent: 'bg-[#c8a96e]/15 text-[#8b6d36]',
  inverted: 'bg-black/20 text-white',
}

export default function Badge({ variant = 'default', className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${variants[variant] || variants.default} ${className}`.trim()}>
      {children}
    </span>
  )
}
