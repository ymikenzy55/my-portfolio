'use client'

import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'

interface SkillItem {
  name: string
  level: number
  category: string
}

interface ExperienceItem {
  period: string
  role: string
  company: string
  description: string
}

interface ResumeData {
  email: string
  phone: string
  location: string
  summary: string
  skills: string[]
  languages: string[]
  jobs: ExperienceItem[]
  education: { title: string; school: string; period: string }[]
  certifications: string[]
}

interface HeroData {
  name: string
  primaryRole: string
  secondaryRoles: string[]
  fullRoleDescription: string
  location: string
  mobileRole: string
}

interface FooterData {
  initials: string
  name: string
  tagline: string
  copyrightName: string
}

export default function ContentAdmin() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [resume, setResume] = useState<ResumeData>({
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    languages: [],
    jobs: [],
    education: [],
    certifications: [],
  })
  const [aboutStats, setAboutStats] = useState<{ value: string; label: string }[]>([])
  const [hero, setHero] = useState<HeroData>({
    name: 'Yeboah Michael',
    primaryRole: 'Software Developer',
    secondaryRoles: ['Graphic Designer', 'UI/UX Designer'],
    fullRoleDescription: 'Software Developer, Graphic & UI/UX Designer',
    location: 'Sunyani, Ghana',
    mobileRole: 'Developer & Designer',
  })
  const [footer, setFooter] = useState<FooterData>({
    initials: 'YM',
    name: 'Yeboah Michael',
    tagline: 'Crafted with obsession. No templates were harmed.',
    copyrightName: 'Yeboah Michael',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'skills' | 'experiences' | 'resume' | 'stats' | 'hero' | 'footer'>('skills')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const res = await fetch('/api/settings')
    const data = await res.json()
    const s = data.settings || {}

    if (s.skills_json) {
      try { setSkills(JSON.parse(s.skills_json)) } catch {}
    } else {
      setSkills([
        { name: 'React / Next.js', level: 95, category: 'Frontend' },
        { name: 'TypeScript', level: 90, category: 'Frontend' },
        { name: 'Three.js / WebGL', level: 85, category: 'Creative' },
        { name: 'GSAP / Framer Motion', level: 92, category: 'Motion' },
        { name: 'Node.js / Express', level: 80, category: 'Backend' },
        { name: 'Figma / Design Systems', level: 88, category: 'Design' },
        { name: 'PostgreSQL / MongoDB', level: 78, category: 'Backend' },
        { name: 'AWS / Vercel / Docker', level: 82, category: 'DevOps' },
      ])
    }

    if (s.experiences_json) {
      try { setExperiences(JSON.parse(s.experiences_json)) } catch {}
    } else {
      setExperiences([
        { period: '2022 — Present', role: 'Lead Creative Developer', company: 'Studio Nexus', description: 'Leading a team of designers and engineers to deliver award-winning digital experiences for Fortune 500 clients.' },
        { period: '2019 — 2022', role: 'Senior Frontend Engineer', company: 'Artisan Digital', description: 'Architected and built complex React applications with a focus on performance, accessibility, and animation.' },
        { period: '2016 — 2019', role: 'UI/UX Designer & Developer', company: 'Freelance', description: 'Collaborated with startups and agencies worldwide, delivering end-to-end digital products from concept to launch.' },
      ])
    }

    if (s.resume_json) {
      try { setResume(JSON.parse(s.resume_json)) } catch {}
    } else {
      setResume({
        email: 'yeboahmichael@example.com',
        phone: '+233 XX XXX XXXX',
        location: 'Sunyani, Ghana',
        summary: 'Passionate software developer and designer with expertise in building modern web applications, crafting intuitive user interfaces, and delivering pixel-perfect designs.',
        skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'Tailwind'],
        languages: ['English — Fluent', 'Twi — Native'],
        jobs: [
          { period: '2022 — Present', role: 'Full Stack Developer', company: 'Freelance', description: 'Building responsive web applications and mobile solutions for clients across various industries.' },
          { period: '2020 — Present', role: 'UI/UX Designer', company: 'Self-employed', description: 'Designing user-centered interfaces, brand identities, and digital experiences for startups and businesses.' },
        ],
        education: [{ title: 'BSc Computer Science', school: 'University Name', period: '2019 — 2023' }],
        certifications: ['Meta Frontend Developer', 'Google UX Design', 'AWS Cloud Practitioner'],
      })
    }

    if (s.about_stats) {
      try { setAboutStats(JSON.parse(s.about_stats)) } catch {}
    } else {
      setAboutStats([
        { value: '8+', label: 'Years Experience' },
        { value: '120+', label: 'Projects Delivered' },
        { value: '45+', label: 'Happy Clients' },
        { value: '12', label: 'Awards Won' },
      ])
    }

    if (s.hero_json) {
      try { setHero((prev) => ({ ...prev, ...JSON.parse(s.hero_json) })) } catch {}
    }

    if (s.footer_json) {
      try { setFooter((prev) => ({ ...prev, ...JSON.parse(s.footer_json) })) } catch {}
    }
  }

  const save = async () => {
    setLoading(true)
    setMessage('')
    const payload: Record<string, string> = {
      skills_json: JSON.stringify(skills),
      experiences_json: JSON.stringify(experiences),
      resume_json: JSON.stringify(resume),
      about_stats: JSON.stringify(aboutStats),
      hero_json: JSON.stringify(hero),
      footer_json: JSON.stringify(footer),
    }
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: payload }),
    })
    if (res.ok) {
      setMessage('Content saved successfully')
    } else {
      setMessage('Failed to save')
    }
    setLoading(false)
  }

  const updateSkill = (index: number, field: keyof SkillItem, value: string | number) => {
    const next = [...skills]
    next[index] = { ...next[index], [field]: value }
    setSkills(next)
  }

  const addSkill = () => setSkills([...skills, { name: '', level: 80, category: 'Frontend' }])
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index))

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    const next = [...experiences]
    next[index] = { ...next[index], [field]: value }
    setExperiences(next)
  }

  const addExperience = () => setExperiences([...experiences, { period: '', role: '', company: '', description: '' }])
  const removeExperience = (index: number) => setExperiences(experiences.filter((_, i) => i !== index))

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const next = [...aboutStats]
    next[index] = { ...next[index], [field]: value }
    setAboutStats(next)
  }

  const addStat = () => setAboutStats([...aboutStats, { value: '', label: '' }])
  const removeStat = (index: number) => setAboutStats(aboutStats.filter((_, i) => i !== index))

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Manage Content</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Edit skills, experiences, resume data, and about stats.</p>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['skills', 'experiences', 'resume', 'stats', 'hero', 'footer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5 mb-8">
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Technical Skills</h2>
            {skills.map((skill, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr,1fr,1fr,auto] gap-3 items-center">
                <input value={skill.name} onChange={(e) => updateSkill(i, 'name', e.target.value)} placeholder="Skill name" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <input value={skill.category} onChange={(e) => updateSkill(i, 'category', e.target.value)} placeholder="Category" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <input type="number" value={skill.level} onChange={(e) => updateSkill(i, 'level', Number(e.target.value))} placeholder="Level (0-100)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <button onClick={() => removeSkill(i)} className="text-xs text-red-500 hover:text-red-600 px-2">Remove</button>
              </div>
            ))}
            <button onClick={addSkill} className="text-xs font-medium text-black dark:text-white hover:underline">+ Add Skill</button>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Work Experience</h2>
            {experiences.map((exp, i) => (
              <div key={i} className="space-y-2 p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={exp.period} onChange={(e) => updateExperience(i, 'period', e.target.value)} placeholder="Period (e.g. 2022 — Present)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                  <input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                </div>
                <input value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} placeholder="Role" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <button onClick={() => removeExperience(i)} className="text-xs text-red-500 hover:text-red-600">Remove</button>
              </div>
            ))}
            <button onClick={addExperience} className="text-xs font-medium text-black dark:text-white hover:underline">+ Add Experience</button>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Resume Data</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <input value={resume.email} onChange={(e) => setResume({ ...resume, email: e.target.value })} placeholder="Email" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
              <input value={resume.phone} onChange={(e) => setResume({ ...resume, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
              <input value={resume.location} onChange={(e) => setResume({ ...resume, location: e.target.value })} placeholder="Location" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
            <textarea value={resume.summary} onChange={(e) => setResume({ ...resume, summary: e.target.value })} placeholder="Professional Summary" rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Skills (comma separated)</label>
              <input value={resume.skills.join(', ')} onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map((s) => s.trim()) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Languages (comma separated)</label>
              <input value={resume.languages.join(', ')} onChange={(e) => setResume({ ...resume, languages: e.target.value.split(',').map((s) => s.trim()) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Certifications (comma separated)</label>
              <input value={resume.certifications.join(', ')} onChange={(e) => setResume({ ...resume, certifications: e.target.value.split(',').map((s) => s.trim()) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">About Stats</h2>
            {aboutStats.map((stat, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr,1fr,auto] gap-3 items-center">
                <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value (e.g. 8+)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label (e.g. Years Experience)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                <button onClick={() => removeStat(i)} className="text-xs text-red-500 hover:text-red-600 px-2">Remove</button>
              </div>
            ))}
            <button onClick={addStat} className="text-xs font-medium text-black dark:text-white hover:underline">+ Add Stat</button>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Hero Section</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input value={hero.name} onChange={(e) => setHero({ ...hero, name: e.target.value })} placeholder="Name" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
              <input value={hero.primaryRole} onChange={(e) => setHero({ ...hero, primaryRole: e.target.value })} placeholder="Primary Role" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
            <input value={hero.fullRoleDescription} onChange={(e) => setHero({ ...hero, fullRoleDescription: e.target.value })} placeholder="Full Role Description" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            <input value={hero.location} onChange={(e) => setHero({ ...hero, location: e.target.value })} placeholder="Location" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            <input value={hero.mobileRole} onChange={(e) => setHero({ ...hero, mobileRole: e.target.value })} placeholder="Mobile Role (short)" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Secondary Roles (comma separated)</label>
              <input value={hero.secondaryRoles.join(', ')} onChange={(e) => setHero({ ...hero, secondaryRoles: e.target.value.split(',').map((s) => s.trim()) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">Footer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input value={footer.initials} onChange={(e) => setFooter({ ...footer, initials: e.target.value })} placeholder="Initials (e.g. YM)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
              <input value={footer.name} onChange={(e) => setFooter({ ...footer, name: e.target.value })} placeholder="Name" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            </div>
            <input value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} placeholder="Tagline" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
            <input value={footer.copyrightName} onChange={(e) => setFooter({ ...footer, copyrightName: e.target.value })} placeholder="Copyright Name" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={save} disabled={loading} className="px-6 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium disabled:opacity-50">
          {loading ? 'Saving...' : 'Save All Content'}
        </button>
        <button onClick={() => setConfirmOpen(true)} className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
          Reset to Defaults
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Reset Content"
        message="This will reset all content to default values. Are you sure?"
        onConfirm={() => { setConfirmOpen(false); load(); setMessage('Reset to defaults') }}
        onCancel={() => setConfirmOpen(false)}
        danger
      />
    </div>
  )
}
