'use client'

import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FooterData {
  initials?: string
  name?: string
  tagline?: string
  copyrightName?: string
  whatsapp?: string
  phone?: string
  location?: string
}

export default function Footer() {
  const [footer, setFooter] = useState<FooterData | null>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/settings', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          const s = data.settings || {}
          if (s.footer_json) {
            try {
              const parsed = JSON.parse(s.footer_json)
              setFooter(parsed)
            } catch {}
          }
        })
        .catch(() => {})
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!footer) return null

  return (
    <footer className="relative py-16 section-padding border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-black/90 dark:text-white/60">
              {footer.initials}
            </span>
            <span className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
            <span className="text-xs tracking-[0.15em] uppercase text-black/70 dark:text-white/30">
              {footer.name}
            </span>
          </motion.div>

          {/* Center */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs text-black/50 dark:text-white/20 text-center"
          >
            {footer.tagline}
          </motion.p>

          {/* Right */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-300"
          >
            Back to top
            <motion.div
              whileHover={{ y: -3 }}
              className="w-8 h-8 glass rounded-full flex items-center justify-center"
            >
              <ArrowUp className="w-3 h-3 text-black/60 dark:text-white/60" />
            </motion.div>
          </motion.button>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-[10px] tracking-[0.1em] uppercase text-black/15 dark:text-white/15">
            &copy; {new Date().getFullYear()} {footer.copyrightName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] tracking-[0.1em] uppercase text-black/15 dark:text-white/15 hover:text-black/40 dark:hover:text-white/40 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[10px] tracking-[0.1em] uppercase text-black/15 dark:text-white/15 hover:text-black/40 dark:hover:text-white/40 transition-colors">
              Terms
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
