export default function FilterChip({ active = false, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.1em] transition-all duration-300 ${
        active
          ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
          : 'border-[#e0d9d0] bg-transparent text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
