'use client'

import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  order: number
  isActive: boolean
}

const emptyLink = {
  id: '',
  name: '',
  url: '',
  icon: 'Link',
  order: 0,
  isActive: true,
}

const iconOptions = ['Link', 'Github', 'Linkedin', 'Twitter', 'Mail', 'Instagram', 'Facebook', 'Youtube', 'Dribbble', 'Globe']

export default function SocialsAdmin() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [form, setForm] = useState(emptyLink)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/social-links')
    const data = await res.json()
    setLinks(data.links || [])
  }

  useEffect(() => {
    load()
  }, [])

  const reset = () => {
    setForm(emptyLink)
    setEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (editing && form.id) {
        const res = await fetch(`/api/social-links/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Update failed')
        setMessage('Link updated')
      } else {
        const res = await fetch('/api/social-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Create failed')
        setMessage('Link created')
      }
      reset()
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (l: SocialLink) => {
    setForm(l)
    setEditing(true)
  }

  const requestDelete = (id: string) => {
    setConfirmTarget(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!confirmTarget) return
    await fetch(`/api/social-links/${confirmTarget}`, { method: 'DELETE' })
    setMessage('Link deleted')
    load()
    setConfirmOpen(false)
    setConfirmTarget(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Social Links</h1>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5 mb-8 space-y-4">
        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{editing ? 'Edit Link' : 'Add New Link'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">URL</label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm">
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
            <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium disabled:opacity-50">
            {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-black dark:text-white font-medium">{l.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">{l.url}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${l.isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                      {l.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(l)} className="text-xs text-black dark:text-white hover:underline mr-4">Edit</button>
                    <button onClick={() => requestDelete(l.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">No social links yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete Social Link"
        message="Are you sure you want to delete this link?"
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null) }}
        danger
      />
    </div>
  )
}
