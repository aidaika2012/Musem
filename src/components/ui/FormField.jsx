import { useId } from 'react'

export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  textarea = false,
  rows = 3,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const id = props.id || generatedId
  const controlClass = 'w-full rounded-xl border border-[#e0d9d0] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e]'

  return (
    <div className={className}>
      <label htmlFor={id} className="section-label mb-1.5 block">{label}</label>
      {textarea
        ? <textarea id={id} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} rows={rows} className={`${controlClass} resize-none`} {...props} />
        : <input id={id} type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={controlClass} {...props} />}
    </div>
  )
}
