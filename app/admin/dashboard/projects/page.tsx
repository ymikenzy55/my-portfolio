'use client'

import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import ImagePicker from '../../components/ImagePicker'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  imageUrl: string
  link: string | null
  githubLink: string | null
  liveLink: string | null
  tags: string[]
  order: number
  isActive: boolean
}

const emptyProject = {
  id: '',
  title: '',
  slug: '',
  description: '',
  category: 'Web Development',
  imageUrl: '',
  link: '' as string | null,
  githubLink: '' as string | null,
  liveLink: '' as string | null,
  tags: '',
  order: 0,
  isActive: true,
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState(emptyProject)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data.projects || [])
  }

  useEffect(() => {
    load()
  }, [])

  const reset = () => {
    setForm(emptyProject)
    setEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const payload = {
      ...form,
      tags: form.tags ? (typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()) : form.tags) : [],
    }

    try {
      if (editing && form.id) {
        const res = await fetch(`/api/projects/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
        setMessage('Project updated successfully')
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Create failed')
        setMessage('Project created successfully')
      }
      reset()
      load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p: Project) => {
    setForm({
      ...p,
      tags: p.tags.join(', '),
      link: p.link || '',
      githubLink: p.githubLink || '',
      liveLink: p.liveLink || '',
    })
    setEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const requestDelete = (id: string) => {
    setConfirmTarget(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!confirmTarget) return
    const res = await fetch(`/api/projects/${confirmTarget}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage('Project deleted')
      load()
    }
    setConfirmOpen(false)
    setConfirmTarget(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Manage Projects</h1>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5 mb-8 space-y-4">
        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{editing ? 'Edit Project' : 'Add New Project'}</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div className="sm:col-span-2">
            <ImagePicker
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              label="Project Image"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">GitHub Link</label>
            <input value={form.githubLink || ''} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Live Link</label>
            <input value={form.liveLink || ''} onChange={(e) => setForm({ ...form, liveLink: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tags (comma separated)</label>
            <input value={form.tags as string} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
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
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
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

      {/* List */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-white/10" />
                      )}
                      <div>
                        <p className="text-black dark:text-white font-medium">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{p.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(p)} className="text-xs text-black dark:text-white hover:underline mr-4">Edit</button>
                    <button onClick={() => requestDelete(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">No projects yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null) }}
        danger
      />
    </div>
  )
}
