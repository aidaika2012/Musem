export default function StatCard({ label, value, icon, iconClassName = '', className = '' }) {
  return (
    <div className={`rounded-2xl border border-[#e0d9d0] bg-white p-6 ${className}`.trim()}>
      {icon && (
        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${iconClassName}`}>
          {icon}
        </div>
      )}
      <p className="mb-1 font-serif text-3xl text-[#1a1a1a]">{value}</p>
      <p className="section-label">{label}</p>
    </div>
  )
}
