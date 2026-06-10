'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface SectionTransitionProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export default function SectionTransition({ children, id, className = '' }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']
  )

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0])

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ opacity, y }}
      className={`relative ${className}`}
    >
      {/* Entry curtain reveal effect */}
      <motion.div
        style={{ clipPath }}
        className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 pointer-events-none z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
