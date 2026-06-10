'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Github, Globe } from 'lucide-react'

interface Project {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  link: string | null
  githubLink: string | null
  liveLink: string | null
  order: number
}

const colorPool = ['from-white/5', 'from-white/[0.04]', 'from-white/5']

function TiltCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -12, y: x * 12 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const CardWrapper = project.link ? 'a' : 'div'
  const cardProps = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative perspective-1000 cursor-pointer"
    >
      <CardWrapper {...cardProps} className="block">
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative glass-card rounded-2xl overflow-hidden h-[360px] sm:h-[400px] md:h-[480px]">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colorPool[index % colorPool.length]} to-transparent opacity-50`} />
          
          {/* Hover glow */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent"
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6 md:p-8">
            {/* Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 dark:text-white/40 px-3 py-1 glass rounded-full">
                  {project.category}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isHovered ? 45 : 0, scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 glass rounded-full flex items-center justify-center"
              >
                <ArrowUpRight className="w-4 h-4 text-black/60 dark:text-white/60" />
              </motion.div>
            </div>

            {/* Middle - Project visual */}
            <div className="flex-1 flex items-center justify-center preserve-3d">
              <motion.div
                animate={{
                  translateZ: isHovered ? 60 : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-36 h-24 sm:w-44 sm:h-28 md:w-64 md:h-40 rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 flex items-center justify-center overflow-hidden"
              >
                {project.imageUrl && project.imageUrl.startsWith('http') ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-xl sm:text-2xl md:text-3xl text-black/20 dark:text-white/20 tracking-wider">
                    {project.title}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Bottom */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-black dark:text-white group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-[0.1em] uppercase text-black/30 dark:text-white/30 px-2.5 sm:px-3 py-1 border border-black/10 dark:border-white/10 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Github className="w-3 h-3" />
                    Source
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Live
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>
      </CardWrapper>
    </motion.div>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [filters, setFilters] = useState<string[]>(['All'])
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const loadProjects = () => {
    fetch('/api/projects', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const list: Project[] = data.projects || []
        setProjects((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(list)) {
            const cats = Array.from(new Set(list.map((p: Project) => p.category)))
            setFilters(['All', ...cats])
            return list
          }
          return prev
        })
      })
      .catch(() => setProjects([]))
  }

  useEffect(() => {
    loadProjects()
    const interval = setInterval(loadProjects, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  return (
    <section ref={sectionRef} id="work" className="relative py-32 md:py-48 section-padding overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 mb-6">
                <span className="w-8 h-[1px] bg-black/20 dark:bg-white/30" />
                Selected Work
              </span>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-black dark:text-white">
                Projects that
                <span className="block text-outline">define craft</span>
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              A curated selection of work spanning web design, brand identity, 
              and interactive experiences.
            </p>
          </div>

          {/* Swipe hint */}
          <div className="flex items-center justify-center gap-2 mb-3 md:hidden">
            <motion.div
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/25 dark:text-white/25">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30">
              Swipe
            </span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/25 dark:text-white/25">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>

          {/* Filters — horizontally swipeable */}
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative flex-shrink-0 snap-start px-4 sm:px-5 py-2.5 text-[11px] sm:text-xs font-medium tracking-[0.1em] uppercase rounded-full transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'glass text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <TiltCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 px-8 py-4 glass rounded-full text-xs font-medium tracking-[0.15em] uppercase text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            View All Projects
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
