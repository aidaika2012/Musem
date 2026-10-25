import { useEffect, useId } from 'react'
import { motion } from 'framer-motion'

export default function Modal({ title, onClose, children, className = '' }) {
  const titleId = useId()

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl ${className}`.trim()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id={titleId} className="font-serif text-2xl text-[#1a1a1a]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0ebe3] transition-colors hover:bg-[#e0d9d0]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
