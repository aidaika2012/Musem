export default function EmptyState({ title, description, action, className = '' }) {
  return (
    <div className={`py-24 text-center ${className}`.trim()}>
      <p className="mb-3 font-serif text-3xl text-[#1a1a1a]">{title}</p>
      {description && <p className="text-[#6b6b6b]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
