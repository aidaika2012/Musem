import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] tracking-[0.1em] uppercase text-[#9b9490]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.to && index < items.length - 1
              ? <Link to={item.to} className="hover:text-[#1a1a1a]">{item.label}</Link>
              : <span aria-current={index === items.length - 1 ? 'page' : undefined} className={index === items.length - 1 ? 'text-[#1a1a1a]' : ''}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
