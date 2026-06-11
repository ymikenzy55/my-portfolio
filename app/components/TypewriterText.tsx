'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TypewriterText({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  tag: Tag = 'span',
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started || !text) return
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return (
    <Tag className={className}>
      {displayed}
      {cursor && !done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle"
        />
      )}
    </Tag>
  )
}
