export default function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center justify-center disabled:cursor-not-allowed ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
