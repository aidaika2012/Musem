import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useTranslation } from '../i18n/useTranslation'
import MuseumMap from '../components/MuseumMap'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]   = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ? [...heroRef.current.children] : [], {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const infoItems = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: t('contact_address'),
      value: 'Museum Avenue, 1\nBishkek 720000, Kyrgyzstan',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      label: t('contact_phone'),
      value: '+996 312 000 000',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: t('contact_email_label'),
      value: 'info@museum.kg',
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>,
      label: t('contact_hours'),
      value: `${t('pv_tue_fri')}: 10–18\n${t('pv_sat_sun')}: 10–19\n${t('pv_monday')}: ${t('pv_closed')}`,
    },
  ]

  const subjects = [
    t('contact_subject_general'),
    t('contact_subject_booking'),
    t('contact_subject_press'),
    t('contact_subject_edu'),
    t('contact_subject_donation'),
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">

        <div ref={heroRef} className="mb-14">
          <p className="section-label mb-3">{t('contact_label')}</p>
          <h1 className="section-title mb-4">{t('contact_title')}</h1>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">

          {/* Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
              <h2 className="font-serif text-2xl mb-6">{t('contact_info_title')}</h2>
              {infoItems.map(item => (
                <div key={item.label} className="flex gap-4 items-start py-4 border-b border-[#f0ebe3] last:border-0">
                  <div className="w-9 h-9 rounded-full bg-[#f0ebe3] flex items-center justify-center flex-shrink-0 text-[#c8a96e]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="section-label mb-0.5">{item.label}</p>
                    <p className="text-[#1a1a1a] text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Real map */}
            <MuseumMap height="280px" />
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8 lg:p-10">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-[#f0ebe3] flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl mb-2">{t('contact_success_title')}</h2>
                <p className="text-[#6b6b6b]">{t('contact_success_desc')}</p>
                <button onClick={() => setSent(false)} className="btn-outline mt-6">{t('contact_send_another')}</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl mb-6">{t('contact_form_title')}</h2>
                <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: t('contact_name'),    key: 'name',  type: 'text',  ph: 'Aibek Mamytbekov' },
                      { label: t('contact_email_f'), key: 'email', type: 'email', ph: 'you@example.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="section-label block mb-1.5">{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                          placeholder={f.ph} required
                          className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#c0b9b0]" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="section-label block mb-1.5">{t('contact_subject')}</label>
                    <select value={form.subject} onChange={e => update('subject', e.target.value)}
                      className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors bg-white text-[#1a1a1a]">
                      <option value="">{t('contact_subject')}</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label block mb-1.5">{t('contact_message')}</label>
                    <textarea value={form.message} onChange={e => update('message', e.target.value)}
                      rows={6} placeholder={t('contact_msg_ph')} required
                      className="w-full border border-[#e0d9d0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a96e] transition-colors resize-none placeholder:text-[#c0b9b0]" />
                  </div>
                  <button type="submit" className="btn-ticket w-full justify-center">{t('contact_send')}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
