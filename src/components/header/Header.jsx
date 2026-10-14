import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../i18n/useTranslation'

const languages = ['EN', 'KG', 'RU', 'ZH']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { language, setLanguage, user } = useApp()
  const { t } = useTranslation()
  const location = useLocation()
  const langRef = useRef(null)
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const navLinks = [
    { label: t('nav_exhibitions'), to: '/exhibitions' },
    { label: t('nav_collection'),  to: '/collection' },
    { label: t('nav_visit'),       to: '/visit' },
    { label: t('nav_about'),       to: '/about' },
  ]

  const navColor = isHomePage && !scrolled ? 'text-white' : 'text-[#1a1a1a]'
  const logoColor = isHomePage && !scrolled ? 'text-white' : 'text-[#1a1a1a]'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? 'bg-[#f8f5f0]/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`link-underline text-[0.75rem] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${navColor}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/"
            className={`font-serif text-2xl tracking-[0.35em] uppercase font-bold transition-colors duration-300 ${logoColor} absolute left-1/2 -translate-x-1/2`}>
            MUSEUM
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4 ml-auto">

            {/* Language switcher */}
            <div className="hidden md:block relative" ref={langRef}>
              <button onClick={() => setLangOpen(v => !v)}
                className={`text-[0.7rem] font-medium tracking-[0.2em] uppercase flex items-center gap-1 transition-colors duration-300 ${navColor}`}>
                {language}
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-7 right-0 bg-[#f8f5f0] border border-[#e0d9d0] rounded-xl overflow-hidden shadow-lg min-w-[90px]">
                    {languages.map(lang => (
                      <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false) }}
                        className={`block w-full text-left px-4 py-2.5 text-[0.7rem] tracking-[0.15em] uppercase font-medium transition-colors hover:bg-[#e0d9d0]
                          ${language === lang ? 'text-[#c8a96e]' : 'text-[#1a1a1a]'}`}>
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <Link to={user ? '/profile' : '/login'}
              className={`hidden md:flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${navColor}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {user ? user.name.split(' ')[0] : t('nav_profile')}
            </Link>

            {/* Tickets */}
            <Link to="/booking" className="hidden md:block btn-ticket text-[0.7rem]">
              {t('nav_tickets')}
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
              className={`flex flex-col gap-[5px] p-2 transition-colors duration-300 ${navColor}`}>
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8.5px]' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-[#1a1a1a] flex flex-col items-center justify-center">
            <nav className="flex flex-col items-center gap-8">
              {[...navLinks,
                { label: t('nav_contact'), to: '/contact' },
                { label: t('nav_booking'), to: '/booking' },
              ].map((link, i) => (
                <motion.div key={link.to}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}>
                  <Link to={link.to} onClick={() => setMenuOpen(false)}
                    className="font-serif text-5xl md:text-7xl text-[#f8f5f0] hover:text-[#c8a96e] transition-colors duration-300">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-0 right-0 flex justify-between items-center px-10">
              <div className="flex gap-4">
                {languages.map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`text-[0.7rem] tracking-[0.2em] uppercase font-medium transition-colors
                      ${language === lang ? 'text-[#c8a96e]' : 'text-[#6b6b6b] hover:text-white'}`}>
                    {lang}
                  </button>
                ))}
              </div>
              <Link to={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}
                className="text-[0.7rem] tracking-[0.2em] uppercase font-medium text-[#6b6b6b] hover:text-white transition-colors">
                {user ? t('nav_profile') : t('nav_login')}
              </Link>
            </motion.div>

            <button onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-[#f8f5f0] p-2" aria-label="Close menu">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
