'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Skill {
  name: string
  level: number
  category: string
}

interface Experience {
  period: string
  role: string
  company: string
  description: string
}

const defaultSkills: Skill[] = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'Three.js / WebGL', level: 85, category: 'Creative' },
  { name: 'GSAP / Framer Motion', level: 92, category: 'Motion' },
  { name: 'Node.js / Express', level: 80, category: 'Backend' },
  { name: 'Figma / Design Systems', level: 88, category: 'Design' },
  { name: 'PostgreSQL / MongoDB', level: 78, category: 'Backend' },
  { name: 'AWS / Vercel / Docker', level: 82, category: 'DevOps' },
]

const defaultExperiences: Experience[] = [
  {
    period: '2022 — Present',
    role: 'Lead Creative Developer',
    company: 'Studio Nexus',
    description: 'Leading a team of designers and engineers to deliver award-winning digital experiences for Fortune 500 clients.',
  },
  {
    period: '2019 — 2022',
    role: 'Senior Frontend Engineer',
    company: 'Artisan Digital',
    description: 'Architected and built complex React applications with a focus on performance, accessibility, and animation.',
  },
  {
    period: '2016 — 2019',
    role: 'UI/UX Designer & Developer',
    company: 'Freelance',
    description: 'Collaborated with startups and agencies worldwide, delivering end-to-end digital products from concept to launch.',
  },
]

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-black/80 dark:text-white/80 font-medium">{skill.name}</span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-black/30 dark:text-white/30">{skill.category}</span>
      </div>
      <div className="h-[2px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-black/40 to-black/20 dark:from-white/40 dark:to-white/20 rounded-full relative"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black/60 dark:bg-white/60 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences)
  const [education, setEducation] = useState('BFA Interaction Design — Rhode Island School of Design')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {}
        if (s.skills_json) {
          try {
            const parsed = JSON.parse(s.skills_json)
            if (Array.isArray(parsed) && parsed.length > 0) setSkills(parsed)
          } catch {}
        }
        if (s.experiences_json) {
          try {
            const parsed = JSON.parse(s.experiences_json)
            if (Array.isArray(parsed) && parsed.length > 0) setExperiences(parsed)
          } catch {}
        }
        if (s.resume_json) {
          try {
            const parsed = JSON.parse(s.resume_json)
            if (parsed.education && parsed.education.length > 0) {
              const edu = parsed.education[0]
              setEducation(`${edu.title} — ${edu.school}`)
            }
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 md:py-48 section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 mb-6">
            <span className="w-8 h-[1px] bg-black/20 dark:bg-white/30" />
            Expertise
          </span>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-black dark:text-white">
            Tools &
            <span className="block text-outline">Experience</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Skills */}
          <motion.div style={{ y }} className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-xs tracking-[0.2em] uppercase text-black/40 dark:text-white/40 mb-8">Technical Skills</h3>
              <div className="space-y-6">
                {skills.map((skill, i) => (
                  <SkillBar key={`${skill.name}-${i}`} skill={skill} index={i} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Experience */}
          <div className="space-y-8 lg:pt-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8"
            >
              Work Experience
            </motion.h3>
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.period}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative pl-8 pb-8 border-l border-black/10 dark:border-white/10 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-[9px] h-[9px] -translate-x-[5px] rounded-full bg-black/20 dark:bg-white/20 group-hover:bg-black/50 dark:group-hover:bg-white/50 transition-colors duration-300" />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-black/30 dark:text-white/30">
                      {exp.period}
                    </span>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-black/20 dark:text-white/20 px-2 py-0.5 glass rounded-full">
                      {exp.company}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-black/90 dark:text-white/90">{exp.role}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Education note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8 pl-8"
            >
              <span className="text-[10px] tracking-[0.15em] uppercase text-black/20 dark:text-white/20">
                {education}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
