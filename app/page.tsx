'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Resume from './components/Resume'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import GlobalStackNav, { type View } from './components/GlobalStackNav'

export default function Home() {
  const [activeView, setActiveView] = useState<View>('hero')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    try {
      fetch('/api/page-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: window.location.pathname }),
      })
    } catch {}
  }, [])

  const navigateTo = useCallback((view: View) => {
    if (view === activeView) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveView(view)
      window.scrollTo({ top: 0, behavior: 'instant' })
      setTimeout(() => setIsTransitioning(false), 700)
    }, 600)
  }, [activeView])

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <Navigation onNavigate={navigateTo} />

      <main className="relative">
        <PageTransition isActive={isTransitioning} />
        <AnimatePresence mode="wait">
          {activeView === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onNavigate={navigateTo} />
            </motion.div>
          )}
          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <About />
            </motion.div>
          )}
          {activeView === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Projects />
            </motion.div>
          )}
          {activeView === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Skills />
            </motion.div>
          )}
          {activeView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Contact />
            </motion.div>
          )}
          {activeView === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Resume />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {activeView !== 'hero' && <Footer />}
      <GlobalStackNav activeView={activeView} onNavigate={navigateTo} />
    </>
  )
}
