export default function MetadataGrid({ items, className = '' }) {
  return (
    <dl className={`grid grid-cols-2 gap-6 md:grid-cols-4 ${className}`.trim()}>
      {items.map(item => (
        <div key={item.label}>
          <dt className="section-label mb-1">{item.label}</dt>
          <dd className="text-sm font-medium text-[#1a1a1a]">{item.value || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
