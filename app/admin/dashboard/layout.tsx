'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<{ name?: string | null; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) {
          if (mounted) router.replace('/admin/login')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        if (data && data.admin) {
          setAdmin(data.admin)
        } else if (data === null) {
          return
        } else {
          router.replace('/admin/login')
        }
      })
      .catch((err) => {
        if (!mounted) return
        router.replace('/admin/login')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Overview' },
    { href: '/admin/dashboard/projects', label: 'Projects' },
    { href: '/admin/dashboard/sections', label: 'Sections' },
    { href: '/admin/dashboard/content', label: 'Content' },
    { href: '/admin/dashboard/messages', label: 'Messages' },
    { href: '/admin/dashboard/socials', label: 'Social Links' },
    { href: '/admin/dashboard/analytics', label: 'Analytics' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-black dark:text-white" />
          </button>
          <h1 className="text-sm font-bold text-black dark:text-white">Portfolio Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#111] border-r border-gray-100 dark:border-white/5 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Portfolio Admin</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{admin.email}</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => {
                  handleLogout()
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
