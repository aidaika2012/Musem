export default function Divider({ className = '', vertical = false }) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={`${vertical ? 'h-full w-px' : 'h-px w-full'} bg-[#e0d9d0] ${className}`.trim()}
    />
  )
}
