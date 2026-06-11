'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AboutSection {
  title?: string | null
  subtitle?: string | null
  content?: string | null
}

interface StatItem {
  value: string
  label: string
}

const defaultStats: StatItem[] = [
  { value: '8+', label: 'Years Experience' },
  { value: '120+', label: 'Projects Delivered' },
  { value: '45+', label: 'Happy Clients' },
  { value: '12', label: 'Awards Won' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [about, setAbout] = useState<AboutSection | null>({
    title: 'Designing the',
    subtitle: 'future of',
    content: 'digital craft\nI am a multidisciplinary creative developer based in Sunyani, Ghana, specializing in software development, UI/UX design, and building premium digital experiences that blend creativity with functionality.\nAs a Full Stack Developer, I craft responsive web applications and robust backend solutions. As a UI/UX Designer, I create intuitive interfaces and brand identities. As a Graphic Designer, I deliver compelling visuals that communicate ideas powerfully.\nWith a foundation in both design and engineering, I bring a unique perspective to every project — one that values aesthetic precision as much as technical excellence.',
  })
  const [stats, setStats] = useState<StatItem[] | null>(defaultStats)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/sections', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          const sections = data.sections || []
          const aboutSection = sections.find((s: any) => s.key === 'about')
          if (aboutSection) setAbout(aboutSection)
        })
        .catch(() => {})

      fetch('/api/settings', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          const settings = data.settings || {}
          if (settings.about_stats) {
            try {
              const parsed = JSON.parse(settings.about_stats)
              if (Array.isArray(parsed) && parsed.length > 0) setStats(parsed)
            } catch {}
          } else {
            setStats(defaultStats)
          }
        })
        .catch(() => {})
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!about || !stats) {
    return (
      <section
        ref={sectionRef}
        id="about"
        className="relative py-32 md:py-48 section-padding overflow-hidden min-h-screen"
      >
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-4 w-24 bg-black/5 dark:bg-white/5 rounded mb-16" />
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-6">
              <div className="h-16 w-3/4 bg-black/5 dark:bg-white/5 rounded" />
              <div className="h-32 w-full bg-black/5 dark:bg-white/5 rounded-2xl" />
            </div>
            <div className="space-y-6 lg:pt-24">
              <div className="h-20 w-full bg-black/5 dark:bg-white/5 rounded" />
              <div className="h-16 w-2/3 bg-black/5 dark:bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const headline = about?.title || 'Designing the'
  const subtitle = about?.subtitle || 'future of'
  const trailing = about?.content?.split('\n')[0] || 'digital craft'
  const paragraphs = about?.content
    ? about.content.split('\n').filter((p) => p.trim())
    : [
        'I am a multidisciplinary creative developer based in San Francisco, specializing in crafting premium digital experiences that blur the line between art and technology.',
        'With a foundation in both design and engineering, I bring a unique perspective to every project — one that values aesthetic precision as much as technical excellence. My work has been recognized by Awwwards, CSS Design Awards, and featured in publications worldwide.',
      ]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 section-padding overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400">
            <span className="w-8 h-[1px] bg-black/20 dark:bg-white/30" />
            About
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Large headline */}
          <motion.div style={{ y: y1 }}>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-black dark:text-white mb-8"
            >
              {headline}
              <span className="block text-outline">{subtitle}</span>
              {trailing}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="glass-card p-8 rounded-2xl"
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed ${i < paragraphs.length - 1 ? 'mb-6' : ''}`}
                >
                  {p}
                </p>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Editorial content */}
          <motion.div style={{ y: y2 }} className="lg:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="relative">
                <span className="absolute -left-4 top-0 text-[8rem] font-display font-bold text-black/[0.03] dark:text-white/[0.03] leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-black/80 dark:text-white/80 text-lg md:text-xl leading-relaxed font-light italic pl-8">
                  Every pixel is an opportunity. Every interaction is a chance
                  to create something memorable. I believe in the power of
                  restraint — in knowing when to add and when to subtract.
                </p>
              </div>

              <div className="pl-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-black/20 dark:bg-white/20" />
                  <span className="text-xs tracking-[0.2em] uppercase text-black/40 dark:text-white/40">Philosophy</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                  Design is not just how it looks — it is how it works, how it
                  feels, and how it makes people feel. I approach every project
                  with obsessive attention to detail and a relentless pursuit of
                  the extraordinary.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="group relative"
            >
              <div className="relative p-6 glass-card rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="block font-display text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
