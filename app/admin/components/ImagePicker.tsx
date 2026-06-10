'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFile = async (file: File) => {
    if (!file) return
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setPreview(data.url)
        onChange(data.url)
      } else {
        setPreview(value)
      }
    } catch {
      setPreview(value)
    } finally {
      setUploading(false)
      URL.revokeObjectURL(localPreview)
    }
  }

  const clear = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />

      {preview ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-lg bg-white/90 text-black text-xs font-medium flex items-center gap-2 hover:bg-white transition-colors"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? 'Uploading...' : 'Change'}
            </button>
            <button
              type="button"
              onClick={clear}
              className="px-4 py-2 rounded-lg bg-red-500/90 text-white text-xs font-medium flex items-center gap-2 hover:bg-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-500 dark:hover:text-gray-400 transition-colors bg-gray-50 dark:bg-white/[0.02]"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
          <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Click to select an image'}</span>
        </button>
      )}
    </div>
  )
}
