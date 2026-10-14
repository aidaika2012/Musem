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
    t('filter_all_collections'),
    'Classical Art', 'Ancient History', 'Modern Art', 'Contemporary Art', 'Cultural Heritage',
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category && category !== t('filter_all_collections')) params.set('category', category)
    if (date) params.set('date', date)
    navigate(`/exhibitions?${params.toString()}`)
  }

  return (
    <section className="py-16 px-6 max-w-[1400px] mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-[#e0d9d0] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-stretch gap-4">

          {/* Type */}
          <div className="flex-1 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-[#e0d9d0] pb-4 md:pb-0 md:pr-6">
            <label className="section-label">{t('filter_type')}</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="bg-transparent font-serif text-xl text-[#1a1a1a] outline-none cursor-pointer">
              <option value="">{t('filter_exhibition')}</option>
              <option>{t('filter_collection')}</option>
              <option>{t('filter_event')}</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex-1 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-[#e0d9d0] pb-4 md:pb-0 md:pr-6">
            <label className="section-label">{t('filter_date')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="bg-transparent font-serif text-xl text-[#1a1a1a] outline-none cursor-pointer" />
          </div>

          {/* Category */}
          <div className="flex-1 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-[#e0d9d0] pb-4 md:pb-0 md:pr-6">
            <label className="section-label">{t('filter_category')}</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-transparent font-serif text-xl text-[#1a1a1a] outline-none cursor-pointer">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Search */}
          <div className="flex-[2] flex flex-col gap-1.5 md:pr-4">
            <label className="section-label">{t('filter_search')}</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t('filter_placeholder')}
              className="bg-transparent font-serif text-xl text-[#1a1a1a] outline-none placeholder:text-[#c0b9b0]" />
          </div>

          {/* Button */}
          <div className="flex items-end">
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
