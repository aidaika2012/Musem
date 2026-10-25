export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
  ...props
}) {
  return (
    <label className={`flex items-center gap-3 rounded-full border border-[#e0d9d0] bg-white px-4 py-2 ${className}`.trim()}>
      <svg className="h-4 w-4 flex-shrink-0 text-[#9b9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 4.65 4.65a7.5 7.5 0 0 0 12 12Z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#c0b9b0]"
        {...props}
      />
    </label>
  )
}
