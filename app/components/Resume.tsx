'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, MapPin, Phone, Briefcase, GraduationCap, Award } from 'lucide-react'

interface ResumeData {
  email: string
  phone: string
  location: string
  summary: string
  skills: string[]
  languages: string[]
  jobs: { period: string; role: string; company: string; description: string }[]
  education: { title: string; school: string; period: string }[]
  certifications: string[]
}

const defaultResume: ResumeData = {
  email: 'yeboahmichael@example.com',
  phone: '+233 XX XXX XXXX',
  location: 'Sunyani, Ghana',
  summary: 'Passionate software developer and designer with expertise in building modern web applications, crafting intuitive user interfaces, and delivering pixel-perfect designs. Experienced in the full development lifecycle from concept to deployment.',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'Tailwind'],
  languages: ['English — Fluent', 'Twi — Native'],
  jobs: [
    { period: '2022 — Present', role: 'Full Stack Developer', company: 'Freelance', description: 'Building responsive web applications and mobile solutions for clients across various industries.' },
    { period: '2020 — Present', role: 'UI/UX Designer', company: 'Self-employed', description: 'Designing user-centered interfaces, brand identities, and digital experiences for startups and businesses.' },
  ],
  education: [{ title: 'BSc Computer Science', school: 'University Name', period: '2019 — 2023' }],
  certifications: ['Meta Frontend Developer', 'Google UX Design', 'AWS Cloud Practitioner'],
}

export default function Resume() {
  const [resume, setResume] = useState<ResumeData>(defaultResume)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {}
        if (s.resume_json) {
          try {
            const parsed = JSON.parse(s.resume_json)
            setResume({ ...defaultResume, ...parsed })
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="relative min-h-screen bg-white dark:bg-[#050505] pt-28 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-3">
            Resume
          </h1>
          <p className="text-sm text-black/40 dark:text-white/40 tracking-wide">
            YEHOAH MICHAEL — SOFTWARE DEVELOPER & DESIGNER
          </p>
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <a
            href="/resume.pdf"
            download
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Download CV
          </a>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-black/60 dark:text-white/60">
                  <Mail className="w-4 h-4" />
                  <span>{resume.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black/60 dark:text-white/60">
                  <Phone className="w-4 h-4" />
                  <span>{resume.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black/60 dark:text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>{resume.location}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-[11px] tracking-wide border border-black/10 dark:border-white/10 rounded-full text-black/60 dark:text-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
                Languages
              </h3>
              <div className="space-y-2 text-sm text-black/60 dark:text-white/60">
                {resume.languages.map((lang) => (
                  <p key={lang}>{lang}</p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-10"
          >
            {/* Summary */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium">
                Professional Summary
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                {resume.summary}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium flex items-center gap-2">
                <Briefcase className="w-3 h-3" />
                Experience
              </h3>
              <div className="space-y-6">
                {resume.jobs.map((job, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="border-l border-black/10 dark:border-white/10 pl-4"
                  >
                    <h4 className="text-sm font-semibold text-black dark:text-white">{job.role}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{job.company} · {job.period}</p>
                    <p className="text-sm text-black/50 dark:text-white/50 mt-2 leading-relaxed">{job.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                Education
              </h3>
              <div className="space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="border-l border-black/10 dark:border-white/10 pl-4">
                    <h4 className="text-sm font-semibold text-black dark:text-white">{edu.title}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{edu.school} · {edu.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-black/30 dark:text-white/30 mb-4 font-medium flex items-center gap-2">
                <Award className="w-3 h-3" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 text-[11px] tracking-wide bg-black/5 dark:bg-white/5 rounded-lg text-black/60 dark:text-white/60"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
