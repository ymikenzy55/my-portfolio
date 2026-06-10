'use client'

import { motion } from 'framer-motion'

export type View = 'hero' | 'about' | 'projects' | 'skills' | 'contact' | 'resume'

interface GlobalStackNavProps {
  activeView: View
  onNavigate: (view: View) => void
}

const links: { label: string; view: View; num: string }[] = [
  { label: 'Home', view: 'hero', num: '00' },
  { label: 'About Me', view: 'about', num: '01' },
  { label: 'Services', view: 'skills', num: '02' },
  { label: 'Projects', view: 'projects', num: '03' },
  { label: 'Resume', view: 'resume', num: '04' },
  { label: 'Contact', view: 'contact', num: '05' },
]

export default function GlobalStackNav({ activeView, onNavigate }: GlobalStackNavProps) {
  const isHero = activeView === 'hero'

  return (
    <div className="fixed right-4 md:right-8 lg:right-12 bottom-8 z-[100] hidden md:block">
      {/* Arrow indicator — only on hero */}
      {isHero && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="absolute -top-14 right-2 flex flex-col items-center gap-1"
        >
          <span className="text-[9px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 whitespace-nowrap">
            Navigate
          </span>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-black/30 dark:text-white/30"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      )}

      <motion.nav
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: isHero ? 1.6 : 0.3 }}
      >
        <div className="space-y-0.5 bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-2xl px-5 py-4 border border-black/5 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/5">
        {links.map((link, i) => {
          const isActive = activeView === link.view
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <button
                onClick={() => onNavigate(link.view)}
                className="group flex items-center gap-3 py-2 text-right w-full hover:translate-x-[-4px] transition-transform duration-300"
              >
                <span
                  className={`text-[10px] tracking-[0.15em] uppercase font-mono transition-opacity duration-300 ${
                    isActive
                      ? 'opacity-100 text-black dark:text-white'
                      : 'opacity-0 group-hover:opacity-100 text-black/30 dark:text-white/30'
                  }`}
                >
                  {link.num}
                </span>
                <span
                  className={`text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${
                    isActive
                      ? 'text-black dark:text-white'
                      : 'text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white'
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`inline-block h-[1px] transition-all duration-300 ${
                    isActive
                      ? 'w-10 bg-black dark:bg-white'
                      : 'w-6 bg-black/20 dark:bg-white/20 group-hover:w-10 group-hover:bg-black dark:group-hover:bg-white'
                  }`}
                />
              </button>
            </motion.div>
          )
        })}
        </div>
      </motion.nav>
    </div>
  )
}
