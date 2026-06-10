'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
  isActive: boolean
}

const COLS = 8
const ROWS = 6
const TOTAL = COLS * ROWS

function getDelay(index: number) {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const centerCol = (COLS - 1) / 2
  const centerRow = (ROWS - 1) / 2
  const distance = Math.abs(col - centerCol) + Math.abs(row - centerRow)
  return distance * 0.04
}

export default function PageTransition({ isActive }: PageTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] pointer-events-none"
        >
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: TOTAL }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: isActive ? getDelay(i) : getDelay(TOTAL - 1 - i),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white dark:bg-[#050505] origin-center"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
