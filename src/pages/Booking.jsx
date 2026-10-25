import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import enPhoneLabels from 'react-phone-number-input/locale/en.json'
import ruPhoneLabels from 'react-phone-number-input/locale/ru.json'
import zhPhoneLabels from 'react-phone-number-input/locale/zh.json'
import 'react-phone-number-input/style.css'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'

const TIMES  = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const PRICES = { Adult: 800, Student: 400, Child: 0, Senior: 400 }

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ?  60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25,0.46,0.45,0.94] } },
  exit:   (dir) => ({ x: dir > 0 ? -60 :  60, opacity: 0, transition: { duration: 0.25 } }),
}

export default function Booking() {
  const { t, language } = useTranslation()
  const phoneLabels = language === 'RU' ? ruPhoneLabels : language === 'ZH' ? zhPhoneLabels : enPhoneLabels
  const { addBooking, user } = useApp()
  const [step, setStep]           = useState(0)
  const [dir,  setDir]            = useState(1)
  const [confirmed, setConfirmed] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [detailsTouched, setDetailsTouched] = useState(false)

  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [tickets, setTickets] = useState({ Adult: 1, Student: 0, Child: 0, Senior: 0 })
  const [form,    setForm]    = useState({ name: user?.name || '', email: user?.email || '', phone: '' })

  const stepLabels = [t('book_step_date'), t('book_step_time'), t('book_step_tickets'), t('book_step_details'), t('book_step_summary')]

  const goTo = (next) => { setDir(next > step ? 1 : -1); setStep(next) }
  const next = () => goTo(step + 1)
  const back = () => goTo(step - 1)

  const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0)
  const totalPrice   = Object.entries(tickets).reduce((s, [k, v]) => s + v * PRICES[k], 0)
  const nameIsValid = Boolean(form.name.trim())
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())
  const phoneIsValid = isValidPhoneNumber(form.phone || '')

  const handleConfirm = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const booking = await addBooking({ date, time, tickets, totalPrice, name: form.name.trim(), email: form.email.trim(), phone: form.phone })
      setConfirmed(booking)
    } catch (error) {
      console.error('Could not save booking:', error)
      setSaveError('Не удалось сохранить бронирование. Проверьте подключение и попробуйте снова.')
    } finally {
      setSaving(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  // ── Success ──────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="pt-28 pb-24 min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}
          className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="section-label mb-3">{t('book_success_label')}</p>
            <h1 className="font-serif text-4xl text-[#1a1a1a] mb-3">{t('book_success_title')}</h1>
            <p className="text-[#6b6b6b] mb-6">{t('book_success_sent')} <strong>{confirmed.email}</strong></p>
            <div className="bg-[#f0ebe3] rounded-2xl p-5 text-left space-y-2 mb-8">
              {[
                { label: t('book_success_id'),    value: confirmed.id },
                { label: t('book_success_date'),  value: confirmed.date },
                { label: t('book_success_time'),  value: confirmed.time },
                { label: t('book_success_total'), value: `${confirmed.totalPrice} KGS` },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-[#9b9490]">{r.label}</span>
                  <span className="font-medium text-[#1a1a1a]">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/profile" className="btn-ticket">{t('book_view_bookings')}</Link>
              <Link to="/" className="btn-outline">{t('book_back_home')}</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24 min-h-screen px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="section-label mb-2">{t('book_label')}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">{t('book_title')}</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                  ${i < step ? 'bg-[#c8a96e] text-white' : i === step ? 'bg-[#1a1a1a] text-white' : 'bg-[#e0d9d0] text-[#9b9490]'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[0.6rem] tracking-[0.1em] uppercase hidden sm:block ${i === step ? 'text-[#1a1a1a]' : 'text-[#9b9490]'}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px transition-colors duration-300 ${i < step ? 'bg-[#c8a96e]' : 'bg-[#e0d9d0]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Panels */}
        <div className="relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">

              {/* Step 0: Date */}
              {step === 0 && (
                <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
                  <h2 className="font-serif text-2xl mb-6">{t('book_select_date')}</h2>
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
                    className="w-full border border-[#e0d9d0] rounded-2xl px-5 py-4 text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors text-lg" />
                  <p className="text-[#9b9490] text-sm mt-3">{t('book_open_info')}</p>
                </div>
              )}

              {/* Step 1: Time */}
              {step === 1 && (
                <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
                  <h2 className="font-serif text-2xl mb-6">{t('book_select_time')}</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {TIMES.map(tm => (
                      <button key={tm} onClick={() => setTime(tm)}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200
                          ${time === tm ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'border-[#e0d9d0] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}>
                        {tm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Tickets */}
              {step === 2 && (
                <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
                  <h2 className="font-serif text-2xl mb-6">{t('book_select_tickets')}</h2>
                  <div className="space-y-4">
                    {Object.entries(PRICES).map(([type, price]) => (
                      <div key={type} className="flex items-center justify-between py-3 border-b border-[#f0ebe3] last:border-0">
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{type}</p>
                          <p className="text-[#9b9490] text-sm">{price === 0 ? t('pv_free') : `${price} KGS`}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setTickets(tk => ({ ...tk, [type]: Math.max(0, tk[type] - 1) }))}
                            className="w-9 h-9 rounded-full border border-[#e0d9d0] flex items-center justify-center text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">−</button>
                          <span className="w-6 text-center font-medium">{tickets[type]}</span>
                          <button onClick={() => setTickets(tk => ({ ...tk, [type]: tk[type] + 1 }))}
                            className="w-9 h-9 rounded-full border border-[#e0d9d0] flex items-center justify-center text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#e0d9d0] flex justify-between font-medium">
                    <span>{t('book_total')}</span>
                    <span className="font-serif text-xl">{totalPrice} KGS</span>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
                  <h2 className="font-serif text-2xl mb-6">{t('book_details_title')}</h2>
                  <div className="space-y-4">
                    {[
                      { label: t('book_name'),  key: 'name',  type: 'text',  ph: t('book_name_ph') },
                      { label: t('book_email'), key: 'email', type: 'email', ph: t('book_email_ph') },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="section-label block mb-1.5" htmlFor={`booking-${f.key}`}>{f.label} *</label>
                        <input type={f.type} value={form[f.key]} placeholder={f.ph}
                          id={`booking-${f.key}`}
                          required
                          aria-invalid={detailsTouched && (f.key === 'name' ? !nameIsValid : !emailIsValid)}
                          aria-describedby={detailsTouched ? `booking-${f.key}-error` : undefined}
                          onBlur={() => setDetailsTouched(true)}
                          onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                          className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-[#1a1a1a] outline-none focus:border-[#c8a96e] transition-colors text-sm placeholder:text-[#c0b9b0]" />
                        {detailsTouched && (f.key === 'name' ? !nameIsValid : !emailIsValid) && (
                          <p id={`booking-${f.key}-error`} className="text-red-600 text-xs mt-2" aria-live="polite">
                            {t(f.key === 'name' ? 'book_name_invalid' : 'book_email_invalid')}
                          </p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="section-label block mb-1.5" htmlFor="booking-phone">{t('book_phone')} *</label>
                      <PhoneInput
                        international
                        defaultCountry="KZ"
                        countryCallingCodeEditable={false}
                        labels={phoneLabels}
                        value={form.phone || undefined}
                        onChange={phone => setForm(previous => ({ ...previous, phone: phone || '' }))}
                        onBlur={() => setPhoneTouched(true)}
                        placeholder={t('book_phone_ph')}
                        autoComplete="tel"
                        numberInputProps={{
                          id: 'booking-phone',
                          'aria-required': true,
                          'aria-invalid': phoneTouched && !phoneIsValid,
                          'aria-describedby': phoneTouched && !phoneIsValid ? 'booking-phone-error' : undefined,
                        }}
                        className={`booking-phone-input${phoneTouched && !phoneIsValid ? ' booking-phone-input--invalid' : ''}`}
                      />
                      {phoneTouched && !phoneIsValid && (
                        <p id="booking-phone-error" className="text-red-600 text-xs mt-2" aria-live="polite">
                          {t('book_phone_invalid')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {step === 4 && (
                <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
                  <h2 className="font-serif text-2xl mb-6">{t('book_confirm_title')}</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: t('book_name'),    value: form.name.trim() },
                      { label: t('book_email'),   value: form.email.trim() },
                      { label: t('book_phone'),   value: form.phone },
                      { label: t('book_step_date'), value: date },
                      { label: t('book_step_time'), value: time },
                      { label: t('book_step_tickets'), value: Object.entries(tickets).filter(([,v]) => v > 0).map(([k,v]) => `${v}× ${k}`).join(', ') },
                      { label: t('book_total'),   value: `${totalPrice} KGS` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-start py-2.5 border-b border-[#f0ebe3] last:border-0">
                        <span className="section-label">{r.label}</span>
                        <span className="text-sm font-medium text-[#1a1a1a] text-right max-w-[60%]">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleConfirm} disabled={saving} className="btn-ticket w-full justify-center text-sm disabled:opacity-50">
                    {saving ? 'Сохраняем…' : t('book_confirm_btn')}
                  </button>
                  {saveError && <p role="alert" className="text-red-600 text-sm mt-3">{saveError}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button onClick={back} disabled={step === 0} className={`btn-outline ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>
            {t('book_back')}
          </button>
          {step < 4 && (
            <button onClick={() => {
              if (step === 3) {
                setDetailsTouched(true)
                setPhoneTouched(true)
                if (!nameIsValid || !emailIsValid || !phoneIsValid) return
              }
              next()
            }}
              disabled={
                (step === 0 && !date) || (step === 1 && !time) ||
                (step === 2 && totalTickets === 0)
              }
              className="btn-ticket disabled:opacity-40 disabled:cursor-not-allowed">
              {t('book_continue')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
