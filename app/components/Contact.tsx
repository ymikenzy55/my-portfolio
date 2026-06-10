'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Linkedin, Github, Twitter, Instagram, Facebook, Youtube, Dribbble, Globe, Send, CheckCircle } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin, Github, Twitter, Mail, Instagram, Facebook, Youtube, Dribbble, Link: Globe, Globe,
}

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const [socials, setSocials] = useState<SocialLink[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])

  useEffect(() => {
    fetch('/api/social-links', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setSocials(data.links || []))
      .catch(() => setSocials([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    setFormError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setFormStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setFormStatus('error')
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 md:py-48 section-padding overflow-hidden">
      {/* Large background text */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[20vw] font-bold text-black/[0.015] dark:text-white/[0.015] whitespace-nowrap">
          Let&apos;s Talk
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 mb-8">
              <span className="w-8 h-[1px] bg-black/20 dark:bg-white/30" />
              Contact
            </span>
            
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] text-black dark:text-white mb-8">
              Let&apos;s create
              <span className="block text-outline">something</span>
              <span className="block">extraordinary</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-md mb-10">
              I am always interested in hearing about new projects and opportunities. 
              Whether you have a question or just want to say hi, I will try my best 
              to get back to you.
            </p>

            <motion.a
              href="mailto:hello@alexmorgan.dev"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold tracking-[0.15em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10">Start a Conversation</span>
              <motion.div
                className="relative z-10"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </motion.a>
          </motion.div>

          {/* Right: Info cards */}
          <motion.div
            style={{ scale }}
            className="space-y-6"
          >
            {/* Location card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 rounded-2xl group hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-black/50 dark:text-white/50" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-2">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Sunyani, Ghana<br />
                    Available for remote work worldwide
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Email card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 rounded-2xl group hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-black/50 dark:text-white/50" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-2">Email</h3>
                  <a
                    href="mailto:yeboahmichael@gmail.com"
                    className="text-gray-600 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    yeboahmichael@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-6">Send a Message</h3>
              {formStatus === 'success' ? (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Message sent successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your phone (optional)"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 resize-none"
                    />
                  </div>
                  {formStatus === 'error' && (
                    <p className="text-xs text-red-500">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {formStatus === 'loading' ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-6">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = iconMap[social.icon] || Globe
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredLink(social.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex items-center gap-3 px-5 py-3 glass rounded-xl hover:bg-white/5 transition-colors duration-300"
                    >
                      <Icon className="w-4 h-4 text-black/50 dark:text-white/50 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors" />
                      <span className="text-xs tracking-[0.1em] uppercase text-black/50 dark:text-white/50 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                        {social.name}
                      </span>
                      {hoveredLink === social.name && (
                        <motion.div
                          layoutId="socialHighlight"
                          className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
