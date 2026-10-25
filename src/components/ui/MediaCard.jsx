import { Link } from 'react-router-dom'

export default function MediaCard({ to, image, alt, title, eyebrow, description, actionLabel, className = '' }) {
  return (
    <Link to={to} className={`group block overflow-hidden rounded-2xl border border-[#e0d9d0] bg-white transition-all hover:-translate-y-1 hover:border-[#c8a96e] ${className}`.trim()}>
      <div className="img-zoom aspect-[16/10] overflow-hidden">
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        {eyebrow && <p className="section-label mb-2">{eyebrow}</p>}
        <h3 className="font-serif text-xl leading-tight text-[#1a1a1a] transition-colors group-hover:text-[#c8a96e]">{title}</h3>
        {description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6b6b6b]">{description}</p>}
        {actionLabel && <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#1a1a1a]">{actionLabel}<span aria-hidden="true">→</span></span>}
      </div>
    </Link>
  )
}
