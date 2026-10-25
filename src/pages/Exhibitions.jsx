import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'
import Container from '../components/ui/Container'
import Divider from '../components/ui/Divider'
import EmptyState from '../components/ui/EmptyState'
import FilterChip from '../components/ui/FilterChip'
import MediaCard from '../components/ui/MediaCard'
import SearchInput from '../components/ui/SearchInput'

const CATS_EN = ['All', 'Classical Art', 'Ancient History', 'Modern Art', 'Contemporary Art', 'Cultural Heritage']

function ExhibitionCard({ ex }) {
  const { t, localize } = useTranslation()
  const item = localize(ex)
  return (
    <div className="relative">
      <MediaCard
        to={`/exhibitions/${ex.id}`}
        image={ex.image}
        alt={item.title}
        eyebrow={`${item.category} · ${item.date}`}
        title={item.title}
        description={item.description}
        actionLabel={t('exh_view')}
        className="h-full rounded-3xl card-shadow"
      />
    </div>
  )
}

export default function Exhibitions() {
  const { t } = useTranslation()
  const { adminExhibitions: exhibitions } = useApp()
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQ, setSearchQ] = useState('')
  const gridRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    setSearchQ(searchParams.get('q') || '')
    const cat = searchParams.get('category') || 'All'
    setActiveCategory(CATS_EN.includes(cat) ? cat : 'All')
  }, [searchParams])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  const filtered = exhibitions.filter(ex => {
    const matchCat = activeCategory === 'All' || ex.category === activeCategory
    const matchQ   = !searchQ || ex.title.toLowerCase().includes(searchQ.toLowerCase())
    return matchCat && matchQ
  })

  // Category labels — always EN for data matching, display key translated
  const catLabels = [
    { key: 'All',               label: t('exh_cat_all') },
    { key: 'Classical Art',     label: t('cat_classical') },
    { key: 'Ancient History',   label: t('cat_ancient') },
    { key: 'Modern Art',        label: t('cat_modern') },
    { key: 'Contemporary Art',  label: t('cat_contemporary') },
    { key: 'Cultural Heritage', label: t('cat_heritage') },
  ]

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Container as="section" ref={heroRef} className="mb-8">
        <p className="section-label mb-3">{t('exh_whats_on')}</p>
        <h1 className="section-title mb-6">{t('exh_title')}</h1>
        <Divider className="mb-6" />
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {catLabels.map(({ key, label }) => (
              <FilterChip key={key} active={activeCategory === key} onClick={() => setActiveCategory(key)}>
                {label}
              </FilterChip>
            ))}
          </div>
          <SearchInput value={searchQ} onChange={setSearchQ} placeholder={t('exh_search_ph')} className="w-full min-w-0 md:w-auto md:min-w-[260px]" />
        </div>
      </Container>

      <Container>
        {filtered.length === 0 ? (
          <EmptyState title={t('exh_no_results')} description={t('exh_no_results_sub')} />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
          </div>
        )}
      </Container>
    </div>
  )
}
