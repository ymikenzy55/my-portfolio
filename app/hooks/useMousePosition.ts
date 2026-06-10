'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })
  
  const rafRef = useRef<number>(0)
  const pendingUpdate = useRef<MousePosition | null>(null)

  const updatePosition = useCallback(() => {
    if (pendingUpdate.current) {
      setPosition(pendingUpdate.current)
      pendingUpdate.current = null
    }
    rafRef.current = requestAnimationFrame(updatePosition)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pendingUpdate.current = {
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth - 0.5) * 2,
        normalizedY: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updatePosition])

  return position
}
