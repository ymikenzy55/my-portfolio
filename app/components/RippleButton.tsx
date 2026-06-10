'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface Ripple {
  x: number
  y: number
  id: number
}

interface RippleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
}

export default function RippleButton({
  children,
  onClick,
  href,
  className = '',
  variant = 'primary',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const idCounter = useRef(0)

  const addRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const id = idCounter.current++

      setRipples((prev) => [...prev, { x, y, id }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 800)
    },
    []
  )

  const baseStyles =
    'relative overflow-hidden cursor-pointer font-medium tracking-[0.1em] uppercase text-xs transition-all duration-300'

  const variantStyles = {
    primary:
      'bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'border border-black/20 dark:border-white/20 text-black dark:text-white px-8 py-4 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]',
    ghost:
      'text-black dark:text-white px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  const content = (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={(e) => {
          addRipple(e)
          onClick?.()
        }}
        className={combinedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={(e) => {
        addRipple(e)
        onClick?.()
      }}
      className={combinedClassName}
    >
      {content}
    </button>
  )
}
