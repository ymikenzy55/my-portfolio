'use client'

import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import ImagePicker from '../../components/ImagePicker'

interface Section {
  id: string
  key: string
  title: string | null
  subtitle: string | null
  content: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
}

export default function SectionsAdmin() {
  const [sections, setSections] = useState<Section[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Section>>({})
  const [message, setMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/sections')
    const data = await res.json()
    setSections(data.sections || [])
  }

  useEffect(() => {
    load()
  }, [])

  const handleEdit = (s: Section) => {
    setEditingId(s.id)
    setForm({ ...s })
  }

  const handleSave = async () => {
    setMessage('')
    const res = await fetch('/api/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setMessage('Section updated')
      setEditingId(null)
      load()
    } else {
      setMessage('Failed to update')
    }
  }

  const requestReset = (id: string) => {
    setConfirmTarget(id)
    setConfirmOpen(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Manage Sections</h1>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.id} className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
            {editingId === s.id ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Title</label>
                    <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Subtitle</label>
                    <input value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <ImagePicker
                      value={form.imageUrl || ''}
                      onChange={(url) => setForm({ ...form, imageUrl: url })}
                      label="Section Image"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Order</label>
                    <input type="number" value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Content</label>
                  <textarea value={form.content || ''} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-black dark:text-white text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive ?? false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt={s.key} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-white/10" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-black dark:text-white capitalize">{s.key}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.title || 'No title'}</p>
                    <span className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleEdit(s)} className="text-xs text-black dark:text-white hover:underline">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Reset Section"
        message="Are you sure you want to reset this section to defaults?"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null) }}
      />
    </div>
  )
}
