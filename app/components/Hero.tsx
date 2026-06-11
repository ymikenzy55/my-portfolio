'use client'

import { motion } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import RippleButton from './RippleButton'
import type { View } from './GlobalStackNav'

interface HeroSection {
  title?: string | null
  subtitle?: string | null
  content?: string | null
  imageUrl?: string | null
}

interface HeroData {
  name?: string
  primaryRole?: string
  secondaryRoles?: string[]
  fullRoleDescription?: string
  location?: string
  mobileRole?: string
}

interface HeroProps {
  onNavigate?: (view: View) => void
}

const defaultHero: HeroSection = {
  title: 'EXPLORE MY',
  subtitle: 'PORTFOLIO',
  content: 'digital craft\nI am a multidisciplinary creative developer based in Sunyani, Ghana, specializing in software development, UI/UX design, and building premium digital experiences that blend creativity with functionality.',
}

const defaultHeroData: HeroData = {
  name: 'Yeboah Michael',
  primaryRole: 'Software Developer',
  secondaryRoles: ['Graphic Designer', 'UI/UX Designer'],
  fullRoleDescription: 'Software Developer, Graphic & UI/UX Designer',
  location: 'Sunyani, Ghana',
  mobileRole: 'Developer & Designer',
}

export default function Hero({ onNavigate }: HeroProps) {
  const [hero, setHero] = useState<HeroSection>(defaultHero)
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData)

  useEffect(() => {
    Promise.all([
      fetch('/api/sections', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/settings', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([sectionsData, settingsData]) => {
        const sections = sectionsData.sections || []
        const heroSection = sections.find((s: any) => s.key === 'hero')
        if (heroSection) {
          const patched = {
            ...heroSection,
            content: (heroSection.content || '')
              .replace(/San Francisco/gi, 'Sunyani, Ghana')
              .replace(/based in the Bay Area/gi, 'based in Sunyani, Ghana'),
          }
          setHero((prev) => ({ ...prev, ...patched }))
        }

        const s = settingsData.settings || {}
        if (s.hero_json) {
          try {
            const parsed = JSON.parse(s.hero_json)
            setHeroData((prev) => ({ ...prev, ...parsed }))
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  const heroImage = hero?.imageUrl || null

  // Patch legacy content that still says San Francisco
  const heroContent = (hero?.content || '')
    .replace(/San Francisco/gi, 'Sunyani, Ghana')
    .replace(/based in the Bay Area/gi, 'based in Sunyani, Ghana')

  return (
    <section className="relative min-h-screen bg-white dark:bg-[#050505] overflow-hidden pt-20">
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-8 pb-16">

        {/* Headlines */}
        <div className="text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="font-display text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.95] tracking-[-0.03em]"
          >
            {hero?.title || ''}
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-display text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.95] tracking-[-0.03em] text-black dark:text-white -mt-2 md:-mt-6"
          >
            {hero?.subtitle || ''}
          </motion.h1>
        </div>

        {/* Mike Photo — Slide-in Info Overlay */}
        <div className="flex flex-col items-center justify-center mt-6 md:mt-4 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative w-[220px] h-[300px] md:w-[320px] md:h-[420px] lg:w-[380px] lg:h-[500px] group"
          >
            {/* Photo */}
            <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-white/5 transition-transform duration-500 group-hover:scale-[1.02]">
              {heroImage && heroImage.startsWith('http') && (
                <img
                  src={heroImage}
                  alt={heroData?.name || ''}
                  className="object-cover object-top w-full h-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

              {heroData && (
                /* Slide-in Overlay on hover */
                <div className="absolute inset-0 flex flex-col justify-end overflow-hidden">
                  <div className="bg-black/80 dark:bg-white/80 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out px-6 py-6 md:py-8 text-center">
                    <h3 className="font-display text-lg md:text-xl font-bold text-white dark:text-black tracking-tight mb-1">
                      {heroData.name}
                    </h3>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 dark:text-black/60 mb-3">
                      {heroData.primaryRole}
                    </p>
                    <div className="w-8 h-[1px] bg-white/20 dark:bg-black/20 mx-auto mb-3" />
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                      {heroData.secondaryRoles?.map((role) => (
                        <span
                          key={role}
                          className="text-[10px] tracking-wide text-white/50 dark:text-black/50"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative ring */}
            <div className="absolute -inset-3 border border-black/5 dark:border-white/5 rounded-3xl pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]" />
          </motion.div>

          {hero?.title && (
            /* Access My Projects CTA */
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => onNavigate?.('projects')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
            >
              Access My Projects
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </motion.button>
          )}
        </div>

        {/* Left side: Name + Role + Location + Arrow */}
        {heroData && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="absolute left-6 md:left-10 lg:left-16 top-[55%] -translate-y-1/2 hidden md:flex flex-col items-start gap-6"
          >
            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="text-[10px] tracking-[0.2em] uppercase text-black/60 dark:text-white/60"
              >
                {heroData.name?.toUpperCase()}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
                className="text-[10px] tracking-[0.15em] uppercase text-black/40 dark:text-white/40 max-w-[140px] leading-relaxed"
              >
                {heroData.fullRoleDescription}
              </motion.p>
              <motion.a
                href="https://www.google.com/maps/search/?api=1&query=Sunyani%2C+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.2 }}
                className="flex items-center gap-2 text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] tracking-[0.15em] uppercase">{heroData.location || 'Sunyani, Ghana'}</span>
              </motion.a>
            </div>
            <RippleButton
              onClick={() => onNavigate?.('about')}
              variant="outline"
              className="!w-12 !h-12 !p-0 flex items-center justify-center !rounded-full"
            >
              <ArrowDown className="w-4 h-4" />
            </RippleButton>
          </motion.div>
        )}

        {/* Right side: Description */}
        {heroContent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute right-6 md:right-10 lg:right-16 top-[32%] -translate-y-1/2 hidden md:block max-w-[180px] text-right"
          >
            <p className="text-[10px] tracking-[0.08em] uppercase text-black/60 dark:text-white/60 leading-relaxed">
              {heroContent}
            </p>
          </motion.div>
        )}

        {/* Mobile info */}
        {heroData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="md:hidden mt-8 space-y-6"
          >
            <div className="text-center space-y-2">
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/60 dark:text:white/60">
                {heroData.name?.toUpperCase()}
              </p>
              <p className="text-[10px] tracking-[0.1em] uppercase text-black/40 dark:text:white/40">
                {heroData.mobileRole}
              </p>
              <div className="flex items-center justify-center gap-2 text-black/40 dark:text-white/40">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] tracking-[0.15em] uppercase">{heroData.location}</span>
              </div>
            </div>
            {heroContent && (
              <p className="text-[10px] tracking-[0.08em] uppercase text-black/60 dark:text-white/60 text-center leading-relaxed px-8">
                {heroContent}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
