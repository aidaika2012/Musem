import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'

const socials = [
  { name: 'Instagram', href: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { name: 'Facebook', href: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { name: 'YouTube', href: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
]

export default function Footer() {
  const { t } = useTranslation()

  const footerLinks = [
    { label: t('nav_exhibitions'), to: '/exhibitions' },
    { label: t('nav_collection'),  to: '/collection' },
    { label: t('nav_visit'),       to: '/visit' },
    { label: t('nav_about'),       to: '/about' },
    { label: t('nav_contact'),     to: '/contact' },
  ]

  return (
    <footer className="bg-[#1a1a1a] text-[#f8f5f0] pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-16 border-b border-white/10">

          {/* Logo */}
          <div>
            <Link to="/" className="font-serif text-3xl tracking-[0.35em] uppercase font-bold block mb-4">MUSEUM</Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs whitespace-pre-line">
              {t('footer_tagline')}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-20">
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-5">{t('footer_explore')}</p>
              <ul className="flex flex-col gap-3">
                {footerLinks.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/60 text-sm hover:text-white transition-colors link-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-5">{t('footer_visit')}</p>
              <ul className="flex flex-col gap-3 text-white/60 text-sm">
                <li>Tue–Fri: 10–18</li>
                <li>Sat–Sun: 10–19</li>
                <li>{t('footer_mon')}</li>
                <li className="mt-2">
                  <Link to="/booking" className="text-[#c8a96e] hover:text-white transition-colors">
                    {t('footer_book')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-5">{t('footer_follow')}</p>
            <div className="flex flex-col gap-4">
              {socials.map(s => (
                <a key={s.name} href={s.href}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    {s.icon}
                  </span>
                  <span className="text-sm">{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-white/30 text-xs">{t('footer_rights')}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/30 text-xs hover:text-white/60 transition-colors">{t('footer_privacy')}</Link>
            <Link to="/terms"   className="text-white/30 text-xs hover:text-white/60 transition-colors">{t('footer_terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
