import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../i18n/useTranslation'

const languages = ['EN', 'KG', 'RU', 'ZH']

function ThemeIcon({ isDark }) {
  return isDark ? (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth="1.7" />
      <path strokeWidth="1.7" strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z" />
    </svg>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { language, setLanguage, user, theme, setTheme } = useApp()
  const { t } = useTranslation()
  const location = useLocation()
  const langRef = useRef(null)
  const isHomePage = location.pathname === '/'
  const isDark = theme === 'dark'

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
    { label: t('nav_collection'), to: '/collection' },
    { label: t('nav_visit'), to: '/visit' },
    { label: t('nav_about'), to: '/about' },
  ]

  const navColor = (isHomePage && !scrolled) || isDark ? 'text-white' : 'text-[#1a1a1a]'
  const logoColor = (isHomePage && !scrolled) || isDark ? 'text-white' : 'text-[#1a1a1a]'
  const headerBackground = scrolled ? (isDark ? 'bg-[#111827]/90' : 'bg-[#f8f5f0]/90') : (isDark ? 'bg-[#111827]/70' : 'bg-transparent')

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBackground} ${scrolled ? 'shadow-sm py-3' : 'py-5'}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`link-underline text-[0.75rem] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${navColor}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Link to="/"
            className={`font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.35em] transition-colors duration-300 ${logoColor} absolute left-1/2 -translate-x-1/2`}>
            MUSEUM
          </Link>

          <div className="ml-auto flex items-center gap-3 xl:gap-6">
            <div className="relative hidden xl:block" ref={langRef}>
              <button onClick={() => setLangOpen(v => !v)}
                className={`flex items-center gap-1 text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${navColor}`}>
                {language}
                <svg className={`h-3 w-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-7 min-w-[90px] overflow-hidden rounded-xl border border-[#e0d9d0] bg-[#f8f5f0] shadow-lg">
                    {languages.map(lang => (
                      <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false) }}
                        className={`block w-full px-4 py-2.5 text-left text-[0.7rem] font-medium uppercase tracking-[0.15em] transition-colors hover:bg-[#e0d9d0] ${language === lang ? 'text-[#c8a96e]' : 'text-[#1a1a1a]'}`}>
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              className={`hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 xl:flex ${navColor}`}>
              <ThemeIcon isDark={isDark} />
              <span>{isDark ? 'Day' : 'Night'}</span>
            </button>

            <Link to={user ? '/profile' : '/login'}
              className={`hidden items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.15em] transition-colors duration-300 xl:flex ${navColor}`}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {user ? user.name.split(' ')[0] : t('nav_profile')}
            </Link>

            {user?.role === 'admin' && (
              <Link to="/admin"
                className={`hidden items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.15em] transition-colors duration-300 xl:flex ${navColor}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('nav_admin')}
              </Link>
            )}

            <Link to="/booking" className="hidden xl:block btn-ticket text-[0.7rem]">
              {t('nav_tickets')}
            </Link>

            <button onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
              className={`flex flex-col gap-[5px] p-2 transition-colors duration-300 ${navColor}`}>
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8.5px]' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#1a1a1a]">
            <nav className="flex flex-col items-center gap-8">
              {[...navLinks, { label: t('nav_contact'), to: '/contact' }, { label: t('nav_booking'), to: '/booking' }].map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}>
                  <Link to={link.to} onClick={() => setMenuOpen(false)} className="mx-4 text-center font-serif text-[clamp(2.5rem,9vw,4.5rem)] text-[#f8f5f0] transition-colors duration-300 hover:text-[#c8a96e] md:text-7xl">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="absolute bottom-6 left-0 right-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-5 sm:bottom-10 sm:justify-between sm:px-10">
              <div className="flex gap-4">
                {languages.map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-colors ${language === lang ? 'text-[#c8a96e]' : 'text-[#6b6b6b] hover:text-white'}`}>
                    {lang}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#6b6b6b] transition-colors hover:text-white">
                <ThemeIcon isDark={isDark} />
                {isDark ? 'Day mode' : 'Night mode'}
              </button>

              <Link to={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}
                className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#6b6b6b] transition-colors hover:text-white">
                {user ? t('nav_profile') : t('nav_login')}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#c8a96e] transition-colors hover:text-white">
                  {t('nav_admin')}
                </Link>
              )}
            </motion.div>

            <button onClick={() => setMenuOpen(false)} className="absolute right-6 top-6 p-2 text-[#f8f5f0]" aria-label="Close menu">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
