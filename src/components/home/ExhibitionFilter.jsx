import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'

export default function ExhibitionFilter() {
  const { t } = useTranslation()
  const [type, setType]         = useState('')
  const [date, setDate]         = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  const categories = [
    { key: '',                   label: t('filter_all_collections') },
    { key: 'Classical Art',      label: t('cat_classical') },
    { key: 'Ancient History',    label: t('cat_ancient') },
    { key: 'Modern Art',         label: t('cat_modern') },
    { key: 'Contemporary Art',   label: t('cat_contemporary') },
    { key: 'Cultural Heritage',  label: t('cat_heritage') },
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category) params.set('category', category)
    if (date) params.set('date', date)
    navigate(`/exhibitions?${params.toString()}`)
  }

  return (
    <section className="py-16 px-6 max-w-[1400px] mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-[#e0d9d0] p-6 md:p-8">
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_2fr_auto]">

          {/* Type */}
          <div className="flex min-w-0 flex-col gap-1.5 border-b border-[#e0d9d0] pb-4 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
            <label className="section-label">{t('filter_type')}</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full min-w-0 bg-transparent font-serif text-base sm:text-xl text-[#1a1a1a] outline-none cursor-pointer">
              <option value="">{t('filter_exhibition')}</option>
              <option>{t('filter_collection')}</option>
              <option>{t('filter_event')}</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex min-w-0 flex-col gap-1.5 border-b border-[#e0d9d0] pb-4 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
            <label className="section-label">{t('filter_date')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full min-w-0 bg-transparent font-serif text-base sm:text-xl text-[#1a1a1a] outline-none cursor-pointer" />
          </div>

          {/* Category */}
          <div className="flex min-w-0 flex-col gap-1.5 border-b border-[#e0d9d0] pb-4 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
            <label className="section-label">{t('filter_category')}</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full min-w-0 bg-transparent font-serif text-base sm:text-xl text-[#1a1a1a] outline-none cursor-pointer">
              {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          {/* Search */}
          <div className="flex min-w-0 flex-col gap-1.5 xl:pr-4">
            <label className="section-label">{t('filter_search')}</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t('filter_placeholder')}
              className="w-full min-w-0 bg-transparent font-serif text-base sm:text-xl text-[#1a1a1a] outline-none placeholder:text-[#c0b9b0]" />
          </div>

          {/* Button */}
          <div className="flex items-end sm:col-span-2 sm:justify-end xl:col-span-1">
            <button onClick={handleSearch} aria-label={t('filter_search')}
              className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#c8a96e] transition-colors duration-300 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0012 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
