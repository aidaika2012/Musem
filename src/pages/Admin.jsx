import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'
import FormField from '../components/ui/FormField'
import Modal from '../components/ui/Modal'
import SearchInput from '../components/ui/SearchInput'
import StatCard from '../components/ui/StatCard'

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

function AdminIcon({ name, className = 'w-5 h-5' }) {
  const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}>
      {name === 'exhibitions' && <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>}
      {name === 'artworks' && <><path d="m14.5 6.5 3 3M4 20l4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z" /><path d="m13 8 3 3" /></>}
      {name === 'bookings' && <><path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Z" /><path d="M13 7v2m0 3v2m0 3v2" /></>}
      {name === 'revenue' && <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>}
      {name === 'site' && <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></>}
      {name === 'dashboard' && <><path d="M3 3v18h18" /><path d="M18 17V9m-5 8V5m-5 12v-4" /></>}
    </svg>
  )
}

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const { adminExhibitions, adminArtworks, bookings } = useApp()
  const { t } = useTranslation()
  const now = new Date()
  const monthFormatter = new Intl.DateTimeFormat('ru', { month: 'short' })
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
    return { key, label: monthFormatter.format(month), count: 0, revenue: 0 }
  })
  const monthlyDataByKey = new Map(monthlyData.map(item => [item.key, item]))

  bookings.forEach(booking => {
    const bookingDate = new Date(booking.createdAt || `${booking.date || ''}T12:00:00`)
    if (Number.isNaN(bookingDate.getTime())) return
    const key = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`
    const month = monthlyDataByKey.get(key)
    if (!month) return
    month.count += 1
    month.revenue += Number(booking.totalPrice) || 0
  })

  const stats = [
    { label: t('adm_total_exhibitions'), value: adminExhibitions.length, icon: 'exhibitions', color: 'bg-blue-50 text-blue-600' },
    { label: t('adm_total_artworks'),    value: adminArtworks.length,    icon: 'artworks', color: 'bg-purple-50 text-purple-600' },
    { label: t('adm_total_bookings'),    value: bookings.length,         icon: 'bookings', color: 'bg-green-50 text-green-600' },
    { label: t('adm_total_revenue'),     value: `${bookings.reduce((s,b)=>s+(b.totalPrice||0),0)} KGS`, icon: 'revenue', color: 'bg-yellow-50 text-yellow-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={<AdminIcon name={s.icon} />}
            iconClassName={s.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'Бронирования по месяцам', key: 'count', color: '#2f7772' },
          { title: 'Выручка по месяцам, KGS', key: 'revenue', color: '#c28b45' },
        ].map(chart => {
          const maximum = Math.max(...monthlyData.map(item => item[chart.key]), 1)
          const plotTop = 18
          const plotHeight = 132
          const chartWidth = 560
          const slotWidth = chartWidth / monthlyData.length
          const barWidth = Math.min(42, slotWidth * 0.55)

          return (
            <section key={chart.key} className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
              <h3 className="font-serif text-xl mb-4">{chart.title}</h3>
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 600 190" role="img" aria-label={chart.title}>
                {[0, 0.5, 1].map(level => {
                  const y = plotTop + plotHeight * (1 - level)
                  return <line key={level} x1="24" x2="584" y1={y} y2={y} stroke="#eee8df" strokeWidth="1" />
                })}
                {monthlyData.map((item, index) => {
                  const value = item[chart.key]
                  const height = (value / maximum) * plotHeight
                  const x = 24 + slotWidth * index + (slotWidth - barWidth) / 2
                  const y = plotTop + plotHeight - height
                  return (
                    <g key={item.key}>
                      <title>{`${item.label}: ${value}`}</title>
                      <rect x={x} y={y} width={barWidth} height={Math.max(height, value ? 3 : 0)} rx="3" fill={chart.color} />
                      <text x={x + barWidth / 2} y="174" textAnchor="middle" fill="#827b73" fontSize="12">{item.label}</text>
                    </g>
                  )
                })}
              </svg>
            </section>
          )
        })}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-[#e0d9d0] p-6">
        <h3 className="font-serif text-xl mb-5">{t('adm_recent_bookings')}</h3>
        {bookings.length === 0 ? (
          <p className="text-[#9b9490] text-sm">{t('adm_no_bookings')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0ebe3]">
                  {[t('adm_col_id'), t('adm_col_name'), t('adm_col_date'), t('adm_col_total'), t('adm_col_status')].map(h => (
                    <th key={h} className="text-left py-3 pr-4 section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 8).map(b => (
                  <tr key={b.id} className="border-b border-[#f0ebe3] last:border-0 hover:bg-[#fafaf8]">
                    <td className="py-3 pr-4 font-mono text-xs text-[#9b9490]">{b.id}</td>
                    <td className="py-3 pr-4 font-medium text-[#1a1a1a]">{b.name || '—'}</td>
                    <td className="py-3 pr-4 text-[#6b6b6b]">{b.date} {b.time}</td>
                    <td className="py-3 pr-4 font-medium text-[#1a1a1a]">{b.totalPrice} KGS</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('adm_view_site'), to: '/', icon: 'site' },
          { label: t('adm_view_bookings_page'), to: '/booking', icon: 'bookings' },
          { label: t('adm_view_collection'), to: '/collection', icon: 'artworks' },
        ].map(l => (
          <Link key={l.to} to={l.to}
            className="bg-white rounded-2xl border border-[#e0d9d0] p-5 flex items-center gap-3 hover:border-[#c8a96e] transition-colors group">
            <AdminIcon name={l.icon} className="w-5 h-5 text-[#9b9490] group-hover:text-[#c8a96e] transition-colors" />
            <span className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── EXHIBITIONS TAB ───────────────────────────────────────────────────────────
function ExhibitionsTab() {
  const { adminExhibitions, addExhibition, updateExhibition, deleteExhibition } = useApp()
  const { t } = useTranslation()
  const [modal, setModal] = useState(null) // null | 'add' | {id, ...}
  const [form, setForm] = useState({ title:'', category:'', date:'', location:'', description:'', curator:'', curatorBio:'', i18n:{} })
  const [translationLanguage, setTranslationLanguage] = useState('EN')
  const [search, setSearch] = useState('')

  const contentFields = translationLanguage === 'EN' ? form : form.i18n?.[translationLanguage] || {}
  const updateContentField = key => value => setForm(previous => {
    if (translationLanguage === 'EN') return { ...previous, [key]: value }
    return {
      ...previous,
      i18n: {
        ...previous.i18n,
        [translationLanguage]: { ...previous.i18n?.[translationLanguage], [key]: value },
      },
    }
  })

  const openAdd = () => {
    setForm({ title:'', category:'', date:'', location:'', description:'', curator:'', curatorBio:'', i18n:{} })
    setTranslationLanguage('EN')
    setModal('add')
  }
  const openEdit = (ex) => {
    setForm({
      title: ex.title,
      category: ex.category,
      date: ex.date,
      location: ex.location,
      description: ex.description,
      curator: ex.curator,
      curatorBio: ex.curatorBio || '',
      i18n: ex.i18n || {},
    })
    setTranslationLanguage('EN')
    setModal(ex)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    const i18n = Object.fromEntries(Object.entries(form.i18n || {})
      .map(([locale, fields]) => [locale, Object.fromEntries(Object.entries(fields)
        .filter(([, value]) => typeof value !== 'string' || value.trim()))])
      .filter(([, fields]) => Object.keys(fields).length > 0))
    const exhibition = { ...form, i18n }
    try {
      if (modal === 'add') {
        await addExhibition({ ...exhibition, image: null, cover: null })
      } else {
        await updateExhibition(modal.id, exhibition)
      }
      setModal(null)
    } catch (error) {
      console.error('Could not save exhibition:', error)
      window.alert('Не удалось сохранить выставку. Проверьте подключение и попробуйте снова.')
    }
  }

  const filtered = adminExhibitions.filter(ex =>
    ex.title.toLowerCase().includes(search.toLowerCase()) ||
    ex.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder={t('adm_search')} className="min-w-[240px]" />
        <button onClick={openAdd} className="btn-ticket text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('adm_add_exhibition')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0d9d0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f5f0]">
              <tr>
                {[t('adm_col_title'), t('adm_col_category'), t('adm_col_date'), t('adm_col_actions')].map(h => (
                  <th key={h} className="text-left px-6 py-4 section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ex => (
                <tr key={ex.id} className="border-t border-[#f0ebe3] hover:bg-[#fafaf8] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {ex.image && <img src={ex.image} alt={ex.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <span className="font-medium text-[#1a1a1a] line-clamp-1">{ex.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-[#f0ebe3] text-[#6b6b6b]">{ex.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[#6b6b6b]">{ex.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(ex)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e0d9d0] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors">
                        {t('adm_edit')}
                      </button>
                      <button onClick={() => deleteExhibition(ex.id).catch(error => {
                        console.error('Could not delete exhibition:', error)
                        window.alert('Не удалось удалить выставку. Проверьте подключение и попробуйте снова.')
                      })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                        {t('adm_delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-[#9b9490]">{t('adm_no_results')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? t('adm_add_exhibition') : t('adm_edit_exhibition')} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="border-t border-[#e0d9d0] pt-4">
                <p className="section-label mb-3">Website content language</p>
                <div className="flex gap-2 mb-4" role="group" aria-label="Translation language">
                  {['EN', 'KG', 'RU', 'ZH'].map(locale => (
                    <button key={locale} type="button" onClick={() => setTranslationLanguage(locale)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${translationLanguage === locale ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'border-[#e0d9d0] text-[#6b6b6b] hover:border-[#1a1a1a]'}`}>
                      {locale}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <FormField label={t('adm_field_title')} value={contentFields.title || ''} onChange={updateContentField('title')} placeholder="Exhibition title" />
                  <FormField label={t('adm_field_category')} value={contentFields.category || ''} onChange={updateContentField('category')} placeholder="Ancient History" />
                  <FormField label={t('adm_field_date')} value={contentFields.date || ''} onChange={updateContentField('date')} placeholder="1 Jan – 30 Jun 2026" />
                  <FormField label={t('adm_field_location')} value={contentFields.location || ''} onChange={updateContentField('location')} placeholder="Gallery A" />
                  <FormField label={t('adm_field_curator')} value={contentFields.curator || ''} onChange={updateContentField('curator')} placeholder="Dr. Name" />
                  <FormField label="Curator biography" value={contentFields.curatorBio || ''} onChange={updateContentField('curatorBio')} textarea placeholder="Curator biography..." />
                  <FormField label={t('adm_field_description')} value={contentFields.description || ''} onChange={updateContentField('description')} textarea placeholder="Description..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-ticket flex-1 justify-center">{t('adm_save')}</button>
                <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">{t('adm_cancel')}</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── ARTWORKS TAB ──────────────────────────────────────────────────────────────
function ArtworksTab() {
  const { adminArtworks, addArtwork, updateArtwork, deleteArtwork } = useApp()
  const { t } = useTranslation()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ title:'', artist:'', year:'', material:'', category:'', location:'', description:'' })
  const [search, setSearch] = useState('')

  const f = k => v => setForm(p => ({ ...p, [k]: v }))

  const openAdd = () => {
    setForm({ title:'', artist:'', year:'', material:'', category:'', location:'', description:'' })
    setModal('add')
  }
  const openEdit = (a) => {
    setForm({ title: a.title, artist: a.artist, year: a.year, material: a.material, category: a.category, location: a.location, description: a.description })
    setModal(a)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    if (modal === 'add') addArtwork({ ...form, image: null, dimensions: '', collection: '' })
    else updateArtwork(modal.id, form)
    setModal(null)
  }

  const filtered = adminArtworks.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.artist.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 border border-[#e0d9d0] rounded-full px-4 py-2 bg-white min-w-[240px]">
          <svg className="w-4 h-4 text-[#9b9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0012 12z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('adm_search')}
            className="bg-transparent text-sm outline-none placeholder:text-[#c0b9b0] flex-1" />
        </div>
        <button onClick={openAdd} className="btn-ticket text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('adm_add_artwork')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-[#e0d9d0] overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden bg-[#f0ebe3]">
              {a.image
                ? <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full flex items-center justify-center text-[#c0b9b0]"><AdminIcon name="artworks" className="w-10 h-10" /></div>
              }
            </div>
            <div className="p-4">
              <p className="font-serif text-sm font-medium text-[#1a1a1a] line-clamp-1 mb-0.5">{a.title}</p>
              <p className="text-xs text-[#9b9490] mb-3">{a.artist} · {a.year}</p>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[#f0ebe3] text-[#6b6b6b]">{a.category}</span>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(a)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-[#e0d9d0] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors">
                  {t('adm_edit')}
                </button>
                <button onClick={() => deleteArtwork(a.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                  {t('adm_delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#9b9490]">{t('adm_no_results')}</div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? t('adm_add_artwork') : t('adm_edit_artwork')} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <FormField label={t('adm_field_title')}       value={form.title}       onChange={f('title')}       placeholder="Artwork title" />
              <FormField label={t('adm_field_artist')}      value={form.artist}      onChange={f('artist')}      placeholder="Artist name" />
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t('adm_field_year')}      value={form.year}        onChange={f('year')}        placeholder="1923" />
                <FormField label={t('adm_field_category')}  value={form.category}    onChange={f('category')}    placeholder="Modern Art" />
              </div>
              <FormField label={t('adm_field_material')}    value={form.material}    onChange={f('material')}    placeholder="Oil on canvas" />
              <FormField label={t('adm_field_location')}    value={form.location}    onChange={f('location')}    placeholder="Gallery E, Room 1" />
              <FormField label={t('adm_field_description')} value={form.description} onChange={f('description')} textarea placeholder="Description..." />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-ticket flex-1 justify-center">{t('adm_save')}</button>
                <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">{t('adm_cancel')}</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── BOOKINGS TAB ──────────────────────────────────────────────────────────────
function BookingsTab() {
  const { bookings, deleteBooking } = useApp()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const filtered = bookings.filter(b =>
    (b.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.email || '').toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  )

  const total = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 border border-[#e0d9d0] rounded-full px-4 py-2 bg-white min-w-[240px]">
          <svg className="w-4 h-4 text-[#9b9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0012 12z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('adm_search')}
            className="bg-transparent text-sm outline-none placeholder:text-[#c0b9b0] flex-1" />
        </div>
        <div className="bg-[#f0ebe3] rounded-full px-4 py-2 text-sm font-medium text-[#1a1a1a]">
          {t('adm_total_revenue')}: <span className="text-[#c8a96e] font-semibold">{total} KGS</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0d9d0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f5f0]">
              <tr>
                {[t('adm_col_id'), t('adm_col_name'), t('adm_col_email'), t('adm_col_date'), t('adm_col_tickets'), t('adm_col_total'), t('adm_col_actions')].map(h => (
                  <th key={h} className="text-left px-5 py-4 section-label whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-t border-[#f0ebe3] hover:bg-[#fafaf8] transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-[#9b9490]">{b.id}</td>
                  <td className="px-5 py-4 font-medium text-[#1a1a1a]">{b.name || '—'}</td>
                  <td className="px-5 py-4 text-[#6b6b6b]">{b.email || '—'}</td>
                  <td className="px-5 py-4 text-[#6b6b6b] whitespace-nowrap">{b.date} {b.time}</td>
                  <td className="px-5 py-4 text-[#6b6b6b] text-xs">
                    {Object.entries(b.tickets || {}).filter(([,v])=>v>0).map(([k,v])=>`${v}×${k}`).join(', ')}
                  </td>
                  <td className="px-5 py-4 font-medium text-[#1a1a1a]">{b.totalPrice} KGS</td>
                  <td className="px-5 py-4">
                    <button onClick={() => deleteBooking(b.id).catch(error => {
                      console.error('Could not delete booking:', error)
                      window.alert('Не удалось удалить бронирование. Проверьте подключение и попробуйте снова.')
                    })}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                      {t('adm_delete')}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#9b9490]">{t('adm_no_bookings')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ADMIN PAGE ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, authLoading, isAdmin } = useApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  if (authLoading) return (
    <div className="pt-28 min-h-screen flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-[#c8a96e]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )

  if (!user || !isAdmin) return (
    <div className="pt-28 pb-24 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl mb-3">{t('adm_access_denied')}</h1>
      <p className="text-[#6b6b6b] mb-8 max-w-sm">{t('adm_access_denied_sub')}</p>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="btn-outline">{t('adm_go_back')}</button>
        <Link to="/" className="btn-ticket">{t('adm_go_home')}</Link>
      </div>
    </div>
  )

  const tabs = [
    { label: t('adm_tab_dashboard'),   icon: 'dashboard' },
    { label: t('adm_tab_exhibitions'), icon: 'exhibitions' },
    { label: t('adm_tab_artworks'),    icon: 'artworks' },
    { label: t('adm_tab_bookings'),    icon: 'bookings' },
  ]

  const panels = [<DashboardTab />, <ExhibitionsTab />, <ArtworksTab />, <BookingsTab />]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-8 border-b border-[#e0d9d0]">
          <div>
            <p className="section-label mb-2">{t('adm_label')}</p>
            <h1 className="font-serif text-4xl text-[#1a1a1a]">{t('adm_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.photoURL
                ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                : <span className="font-serif text-white text-lg">{user.name.charAt(0).toUpperCase()}</span>}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">{user.name}</p>
              <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[#c8a96e]/20 text-[#c8a96e] font-medium uppercase tracking-wider">
                {t('adm_role_admin')}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab, i) => (
            <button key={tab.label} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium tracking-[0.04em] transition-all duration-300
                ${activeTab === i
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'bg-white border border-[#e0d9d0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#1a1a1a]'}`}>
              <AdminIcon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabVariants} initial="initial" animate="animate" exit="exit">
            {panels[activeTab]}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
