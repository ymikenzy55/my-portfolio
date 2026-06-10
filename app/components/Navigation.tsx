'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Phone } from 'lucide-react'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import type { View } from './GlobalStackNav'
import logoImg from '../../public/Miek_sLogo-removebg-preview.png'

const socialIcons = [
  {
    name: 'Gmail',
    href: 'mailto:yeboahmichael@example.com',
    icon: <Mail className="w-3.5 h-3.5" />,
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: <Linkedin className="w-3.5 h-3.5" />,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: <Github className="w-3.5 h-3.5" />,
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/233XXXXXXXXX',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.13 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: 'Call',
    href: 'tel:+233XXXXXXXXX',
    icon: <Phone className="w-3.5 h-3.5" />,
  },
]

interface NavigationProps {
  onNavigate?: (view: View) => void
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[70] bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'shadow-lg shadow-black/5 dark:shadow-white/5 border-b border-black/5 dark:border-white/5' : ''
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('hero')}
            className="relative w-9 h-9 md:w-11 md:h-11 flex-shrink-0"
            aria-label="Go to homepage"
          >
            <Image
              src={logoImg}
              alt="Logo"
              fill
              className="object-contain transition-all duration-500 dark:invert"
              priority
            />
          </button>

          {/* Center — Social Icons */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />

            {/* Animated Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-8 h-8 flex items-center justify-center text-black dark:text-white md:hidden"
              aria-label="Menu"
            >
              <div className="relative w-4 h-3 flex flex-col justify-between">
                <motion.span
                  animate={{
                    rotate: menuOpen ? 45 : 0,
                    y: menuOpen ? 5 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="block w-full h-[1.5px] bg-current origin-center"
                />
                <motion.span
                  animate={{
                    opacity: menuOpen ? 0 : 1,
                    scaleX: menuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="block w-full h-[1.5px] bg-current"
                />
                <motion.span
                  animate={{
                    rotate: menuOpen ? -45 : 0,
                    y: menuOpen ? -5 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="block w-full h-[1.5px] bg-current origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate ?? (() => {})}
        navItems={[
          { label: 'Home', view: 'hero' },
          { label: 'About Me', view: 'about' },
          { label: 'Services', view: 'skills' },
          { label: 'Projects', view: 'projects' },
          { label: 'Resume', view: 'resume' },
          { label: 'Contact', view: 'contact' },
        ]}
      />
    </>
  )
}
