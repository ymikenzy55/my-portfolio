'use client'

import { useState, useCallback, useEffect } from 'react'
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
  const [targetView, setTargetView] = useState<View>('hero')

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
    setTargetView(view)
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveView(view)
      window.scrollTo({ top: 0, behavior: 'instant' })
      setTimeout(() => setIsTransitioning(false), 550)
    }, 480)
  }, [activeView])

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <Navigation onNavigate={navigateTo} />

      <main className="relative">
        <PageTransition isActive={isTransitioning} targetView={targetView} />
        {activeView === 'hero' && <Hero onNavigate={navigateTo} />}
        {activeView === 'about' && <About />}
        {activeView === 'projects' && <Projects />}
        {activeView === 'skills' && <Skills />}
        {activeView === 'contact' && <Contact />}
        {activeView === 'resume' && <Resume />}
      </main>

      {activeView !== 'hero' && !isTransitioning && <Footer />}
      <GlobalStackNav activeView={activeView} onNavigate={navigateTo} />
    </>
  )
}
