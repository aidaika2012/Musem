export default function SectionHeading({
  label,
  title,
  description,
  as: Heading = 'h2',
  className = '',
}) {
  return (
    <div className={className}>
      {label && <p className="section-label mb-3">{label}</p>}
      <Heading className="section-title">{title}</Heading>
      {description && <p className="mt-4 max-w-2xl text-[#6b6b6b] leading-relaxed">{description}</p>}
    </div>
  )
}
