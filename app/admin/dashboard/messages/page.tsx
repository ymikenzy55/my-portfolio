'use client'

import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'

interface Message {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/contact-messages')
    const data = await res.json()
    setMessages(data.messages || [])
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (ids: string[], read: boolean) => {
    await fetch('/api/contact-messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, read }),
    })
    load()
  }

  const requestDelete = (id: string) => {
    setConfirmTarget(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!confirmTarget) return
    await fetch(`/api/contact-messages/${confirmTarget}`, { method: 'DELETE' })
    setSelected((prev) => (prev?.id === confirmTarget ? null : prev))
    load()
    setConfirmOpen(false)
    setConfirmTarget(null)
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">Contact Messages</h1>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden max-h-[600px] overflow-y-auto">
          {messages.length === 0 && (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">No messages yet</div>
          )}
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m)
                if (!m.read) markRead([m.id], true)
              }}
              className={`w-full text-left p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                selected?.id === m.id ? 'bg-gray-50 dark:bg-white/5' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-black dark:text-white">{m.name}</span>
                {!m.read && <span className="w-2 h-2 rounded-full bg-red-500" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.email}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">{selected.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selected.email}</p>
                  {selected.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{selected.phone}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markRead([selected.id], !selected.read)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    {selected.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => requestDelete(selected.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your message`}
                  className="inline-flex px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 p-12 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null) }}
        danger
      />
    </div>
  )
}
