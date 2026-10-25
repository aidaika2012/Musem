import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '../../i18n/useTranslation'
import heroImg from '../../assets/image.png'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef  = useRef(null)
  const imgRef      = useRef(null)
  const titleRef    = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef      = useRef(null)
  const overlayRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(imgRef.current,     { scale: 1.15, duration: 1.8 }, 0)
      tl.from(overlayRef.current, { opacity: 0, duration: 1.2 }, 0)
      const letters = titleRef.current.querySelectorAll('.hero-letter')
      tl.from(letters,            { y: '120%', opacity: 0, duration: 1.2, stagger: 0.06 }, 0.3)
      tl.from(subtitleRef.current,{ y: 30, opacity: 0, duration: 0.9 }, 0.9)
      tl.from(ctaRef.current,     { y: 20, opacity: 0, duration: 0.7 }, 1.1)
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(titleRef.current, {
        y: -60, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(subtitleRef.current, {
        y: -40, opacity: 0.3, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[92svh] min-h-[520px] w-full overflow-hidden sm:min-h-[600px]">
      <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem]">
        <img ref={imgRef}
          src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1800&q=85"
          alt="Museum interior" className="w-full h-full object-cover"
          style={{ transformOrigin: 'center center' }} />
        <div ref={overlayRef} className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,.25) 40%,rgba(0,0,0,.72) 100%)' }} />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div ref={titleRef} className="overflow-hidden flex" aria-label="MUSEUM">
          {'MUSEUM'.split('').map((letter, i) => (
            <span key={i} className="hero-letter font-serif text-white leading-none select-none"
              style={{ fontSize: 'clamp(3.5rem,14vw,18rem)', letterSpacing: '-0.02em', display: 'inline-block' }}>
              {letter}
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
          <p ref={subtitleRef} className="text-white/80 text-base md:text-lg font-light max-w-sm leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {t('hero_discover')}
          </p>
          <div ref={ctaRef}>
            <Link to="/booking"
              className="inline-flex items-center gap-3 bg-white/10 border border-white/30 backdrop-blur-sm
                text-white rounded-full px-8 py-4 text-sm font-medium tracking-[0.12em] uppercase
                hover:bg-white hover:text-[#1a1a1a] transition-all duration-400 group">
              {t('hero_cta')}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 sm:flex">
        <span className="text-white text-[0.65rem] tracking-[0.25em] uppercase">{t('hero_scroll')}</span>
        <div className="w-px h-10 bg-white/50 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
