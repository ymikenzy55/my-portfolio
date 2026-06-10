'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    let raf: number
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12
      pos.current.y += (target.current.y - pos.current.y) * 0.12

      if (glowRef.current) {
        glowRef.current.style.left = `${pos.current.x}px`
        glowRef.current.style.top = `${pos.current.y}px`
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${target.current.x}px`
        dotRef.current.style.top = `${target.current.y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${target.current.x}px`
        ringRef.current.style.top = `${target.current.y}px`
      }
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow hidden md:block" style={{ left: 0, top: 0 }} />
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-black dark:bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
        style={{ left: 0, top: 0 }}
      />
      <div
        ref={ringRef}
        className="fixed w-8 h-8 border border-black/20 dark:border-white/20 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-transform duration-150"
        style={{ left: 0, top: 0 }}
      />
    </>
  )
}
