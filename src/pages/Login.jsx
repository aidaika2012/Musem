import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'
import heroIcon from '../assets/hero.png'

function firebaseErrorMessage(code, t) {
  const map = {
    'auth/user-not-found':       t('login_err_fields'),
    'auth/wrong-password':       t('login_err_fields'),
    'auth/invalid-credential':   t('login_err_fields'),
    'auth/email-already-in-use': 'Email already in use.',
    'auth/weak-password':        t('login_err_short'),
    'auth/invalid-email':        t('login_err_fields'),
    'auth/too-many-requests':    'Too many attempts. Try again later.',
    'auth/network-request-failed': 'No internet connection.',
  }
  return map[code] || t('login_err_fields')
}

export default function Login() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useApp()
  const navigate = useNavigate()

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError(t('login_err_fields')); return }
    if (!isLogin && !form.name)        { setError(t('login_err_name'));   return }
    if (!isLogin && form.password !== form.confirm) { setError(t('login_err_match')); return }
    if (!isLogin && form.password.length < 6)       { setError(t('login_err_short')); return }

    setLoading(true)
    try {
      if (isLogin) await login(form.email, form.password)
      else         await register(form.name.trim(), form.email, form.password)
      navigate('/profile')
    } catch (err) {
      setError(firebaseErrorMessage(err.code, t))
    } finally {
      setLoading(false)
    }
  }

  const tabVariants = {
    enter:  (dir) => ({ x: dir > 0 ?  40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit:   (dir) => ({ x: dir > 0 ? -40 :  40, opacity: 0, transition: { duration: 0.2 } }),
  }

  return (
    <div className="pt-20 pb-24 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl tracking-[0.3em] uppercase font-bold text-[#1a1a1a]">
            MUSEUM
          </Link>
        </div>

        {/* Toggle */}
        <div className="flex bg-[#f0ebe3] rounded-full p-1 mb-8">
          {[t('login_tab'), t('register_tab')].map((tab, i) => (
            <button key={tab} onClick={() => { setIsLogin(i === 0); setError('') }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium tracking-[0.08em] uppercase transition-all duration-300
                ${(i === 0) === isLogin ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-[#6b6b6b]'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={isLogin ? -1 : 1}>
            <motion.form key={isLogin ? 'login' : 'register'} custom={isLogin ? -1 : 1}
              variants={tabVariants} initial="enter" animate="center" exit="exit"
              onSubmit={handleSubmit} className="space-y-4">

              <div className="mb-2">
                <h2 className="font-serif text-2xl text-[#1a1a1a]">
                  {isLogin ? t('login_title') : t('register_title')}
                </h2>
                <p className="text-[#9b9490] text-sm mt-1">
                  {isLogin ? t('login_subtitle') : t('register_subtitle')}
                </p>
              </div>

              {!isLogin && (
                <div>
                  <label className="section-label block mb-1.5">{t('login_name')}</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="Aibek Mamytbekov"
                    className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#c0b9b0]" />
                </div>
              )}

              <div>
                <label className="section-label block mb-1.5">{t('login_email')}</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#c0b9b0]" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="section-label">{t('login_password')}</label>
                  {isLogin && (
                    <button type="button" className="text-[0.7rem] text-[#c8a96e] hover:underline">
                      {t('login_forgot')}
                    </button>
                  )}
                </div>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#c0b9b0]" />
              </div>

              {!isLogin && (
                <div>
                  <label className="section-label block mb-1.5">{t('login_confirm')}</label>
                  <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)}
                    placeholder="••••••••" autoComplete="new-password"
                    className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#c0b9b0]" />
                </div>
              )}

              {isLogin && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#c8a96e]" />
                  <span className="text-sm text-[#6b6b6b]">{t('login_remember')}</span>
                </label>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-ticket w-full justify-center disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isLogin ? t('login_loading') : t('register_loading')}
                  </span>
                ) : (isLogin ? t('login_btn') : t('register_btn'))}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
