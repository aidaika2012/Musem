import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import galleryImg from '../assets/image copy.png'
import exhibitImg from '../assets/image copy 2.png'
import scienceImg from '../assets/image copy 3.png'

gsap.registerPlugin(ScrollTrigger)

const timelineData = [
  { year: '1890', eventKey: 'about_tl1_event', descKey: 'about_tl1_desc' },
  { year: '1925', eventKey: 'about_tl2_event', descKey: 'about_tl2_desc' },
  { year: '1960', eventKey: 'about_tl3_event', descKey: 'about_tl3_desc' },
  { year: '1991', eventKey: 'about_tl4_event', descKey: 'about_tl4_desc' },
  { year: '2008', eventKey: 'about_tl5_event', descKey: 'about_tl5_desc' },
  { year: '2026', eventKey: 'about_tl6_event', descKey: 'about_tl6_desc' },
]

const team = [
  { nameKey: 'about_team1_name', roleKey: 'about_team1_role', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { nameKey: 'about_team2_name', roleKey: 'about_team2_role', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { nameKey: 'about_team3_name', roleKey: 'about_team3_role', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { nameKey: 'about_team4_name', roleKey: 'about_team4_role', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
]

export default function About() {
  const { t } = useTranslation()
  const heroRef     = useRef(null)
  const timelineRef = useRef(null)
  const teamRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ? [...heroRef.current.children] : [], {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      })
      timelineRef.current?.querySelectorAll('.tl-item').forEach(item => {
        gsap.from(item, { x: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' } })
      })
      const cards = teamRef.current?.querySelectorAll('.team-card')
      cards && gsap.from([...cards], {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const values = [
    { title: t('about_v1'), desc: t('about_v1_desc') },
    { title: t('about_v2'), desc: t('about_v2_desc') },
    { title: t('about_v3'), desc: t('about_v3_desc') },
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">

        <div ref={heroRef} className="mb-20">
          <p className="section-label mb-3">{t('about_label')}</p>
          <h1 className="font-serif text-[clamp(2.5rem,7vw,7rem)] leading-[1.05] mb-8 max-w-4xl">
            {t('about_tagline')}
          </h1>
          <div className="divider" />
        </div>

        {/* Mission + Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="section-label mb-3">{t('about_mission_label')}</p>
            <h2 className="font-serif text-3xl mb-4">{t('about_mission_title')}</h2>
            <p className="text-[#6b6b6b] leading-relaxed">{t('about_mission_desc')}</p>
          </div>
          <div>
            <p className="section-label mb-3">{t('about_values_label')}</p>
            <div className="space-y-4">
              {values.map(v => (
                <div key={v.title} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-[#c8a96e] flex-shrink-0 mt-2" />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{v.title}</p>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture — local image */}
        <div className="rounded-3xl overflow-hidden aspect-[21/9] mb-20">
          <img src={scienceImg} alt={t('about_arch_label')} className="w-full h-full object-cover" />
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <p className="section-label mb-3">{t('about_timeline_label')}</p>
          <h2 className="font-serif text-4xl mb-12">{t('about_timeline_title')}</h2>
          <div ref={timelineRef} className="relative">
            <div className="absolute left-[72px] md:left-[96px] top-0 bottom-0 w-px bg-[#e0d9d0]" />
            <div className="space-y-10">
              {timelineData.map(item => (
                <div key={item.year} className="tl-item flex gap-6 md:gap-10 relative">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0 w-16 md:w-24">
                    <div className="w-3 h-3 rounded-full bg-[#c8a96e] relative z-10 mt-1" />
                    <p className="font-serif text-[#c8a96e] text-sm md:text-base font-medium">{item.year}</p>
                  </div>
                  <div className="pb-2 flex-1">
                    <h3 className="font-serif text-xl md:text-2xl text-[#1a1a1a] mb-1">{t(item.eventKey)}</h3>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <p className="section-label mb-3">{t('about_team_label')}</p>
          <h2 className="font-serif text-4xl mb-10">{t('about_team_title')}</h2>
          <div ref={teamRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.nameKey} className="team-card">
                <div className="img-zoom rounded-2xl overflow-hidden aspect-[3/4] mb-4">
                  <img src={member.image} alt={t(member.nameKey)} className="w-full h-full object-cover" />
                </div>
                <p className="font-serif text-lg text-[#1a1a1a]">{t(member.nameKey)}</p>
                <p className="text-[0.72rem] text-[#9b9490] tracking-[0.1em] uppercase mt-0.5">{t(member.roleKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-[#1a1a1a] rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">{t('about_cta_title')}</h2>
          <p className="text-white/60 max-w-md mx-auto mb-8">{t('about_cta_desc')}</p>
          <Link to="/booking" className="inline-flex items-center gap-3 bg-[#c8a96e] text-[#1a1a1a] rounded-full px-8 py-4 text-sm font-medium tracking-[0.12em] uppercase hover:bg-white transition-colors">
            {t('about_cta_btn')}
          </Link>
        </div>
      </div>
    </div>
  )
}
