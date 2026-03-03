'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BentoCardProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2
  delay?: number
}

export function BentoCard({ 
  children, 
  className = '', 
  colSpan = 1,
  rowSpan = 1,
  delay = 0 
}: BentoCardProps) {
  const colSpanClass = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  }[colSpan]

  const rowSpanClass = rowSpan === 2 ? 'md:row-span-2' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`
        bg-white rounded-[2rem] border border-slate-200/50
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
        overflow-hidden
        ${colSpanClass}
        ${rowSpanClass}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  )
}
