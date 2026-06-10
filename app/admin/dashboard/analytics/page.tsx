'use client'

import { useEffect, useState } from 'react'

interface PageView {
  id: string
  path: string
  ip: string | null
  userAgent: string | null
  createdAt: string
}

export default function AnalyticsAdmin() {
  const [total, setTotal] = useState(0)
  const [today, setToday] = useState(0)
  const [views, setViews] = useState<PageView[]>([])

  const load = async () => {
    const res = await fetch('/api/page-views')
    const data = await res.json()
    setTotal(data.total || 0)
    setToday(data.today || 0)
    setViews(data.views || [])
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Views</p>
          <p className="text-4xl font-bold text-black dark:text-white">{total}</p>
        </div>
        <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Today</p>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{today}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Recent Views</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Path</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {views.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-6 py-3 text-black dark:text-white font-mono text-xs">{v.path}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400 text-xs">{v.ip || 'Unknown'}</td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {views.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">No views recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
