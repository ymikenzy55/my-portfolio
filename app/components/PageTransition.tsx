'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
  isActive: boolean
  targetView?: string
}

const VIEW_TITLES: Record<string, string> = {
  hero: 'HOME',
  about: 'ABOUT',
  projects: 'PROJECTS',
  skills: 'SERVICES',
  contact: 'CONTACT',
  resume: 'RESUME',
}

export default function PageTransition({ isActive, targetView }: PageTransitionProps) {
  const displayTitle = targetView ? (VIEW_TITLES[targetView] ?? targetView.toUpperCase()) : ''

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="transition"
          className="fixed inset-0 z-[60] pointer-events-none overflow-hidden flex"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Panel 1 — slides from left */}
          <motion.div
            className="flex-1 bg-white dark:bg-[#050505] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{
              duration: 0.35,
              delay: 0,
              exit: { duration: 0.3, delay: 0.08 },
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {/* Panel 2 — slides from right */}
          <motion.div
            className="flex-1 bg-white dark:bg-[#050505] origin-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.04,
              exit: { duration: 0.3, delay: 0.04 },
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {/* Panel 3 — slides from left */}
          <motion.div
            className="flex-1 bg-white dark:bg-[#050505] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.08,
              exit: { duration: 0.3, delay: 0 },
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Page title — light text only, no card */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-[61]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.35,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {displayTitle}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
