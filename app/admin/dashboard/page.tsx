'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardOverview() {
  const [stats, setStats] = useState({ projects: 0, sections: 0, messages: 0, views: 0, todayViews: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/sections').then((r) => r.json()),
      fetch('/api/contact-messages').then((r) => r.json()),
      fetch('/api/page-views').then((r) => r.json()),
    ]).then(([pRes, sRes, mRes, vRes]) => {
      setStats({
        projects: pRes.projects?.length || 0,
        sections: sRes.sections?.length || 0,
        messages: mRes.messages?.filter((m: any) => !m.read).length || 0,
        views: vRes.total || 0,
        todayViews: vRes.today || 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.projects, href: '/admin/dashboard/projects', color: 'text-black dark:text-white' },
    { label: 'Active Sections', value: stats.sections, href: '/admin/dashboard/sections', color: 'text-black dark:text-white' },
    { label: 'Unread Messages', value: stats.messages, href: '/admin/dashboard/messages', color: stats.messages > 0 ? 'text-red-500' : 'text-black dark:text-white' },
    { label: 'Total Views', value: stats.views, href: '/admin/dashboard/analytics', color: 'text-black dark:text-white' },
    { label: 'Today Views', value: stats.todayViews, href: '/admin/dashboard/analytics', color: 'text-emerald-600 dark:text-emerald-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors cursor-pointer">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
