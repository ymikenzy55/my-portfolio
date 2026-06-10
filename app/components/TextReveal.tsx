'use client'

import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  speed = 0.05,
  tag: Tag = 'span',
}: TextRevealProps) {
  const characters = text.split('')

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="visible"
        aria-label={text}
        className="inline-block"
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
