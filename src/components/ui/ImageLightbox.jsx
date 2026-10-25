import { useEffect, useState } from 'react'

export default function ImageLightbox({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = event => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Enlarge ${alt}`} className={`img-zoom block w-full cursor-zoom-in overflow-hidden ${className}`.trim()}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onMouseDown={event => event.target === event.currentTarget && setOpen(false)}
        >
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-2xl object-contain" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close image" className="absolute right-6 top-6 text-white/80 hover:text-white">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
