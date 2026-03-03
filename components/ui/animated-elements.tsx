'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}

export function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(easeOut * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

interface StatusIndicatorProps {
  status: 'ok' | 'error' | 'warning' | 'running' | 'idle'
  pulse?: boolean
}

export function StatusIndicator({ status, pulse = true }: StatusIndicatorProps) {
  const colors = {
    ok: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    running: 'bg-blue-500',
    idle: 'bg-slate-400',
  }

  return (
    <div className="relative flex items-center">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      {pulse && status === 'running' && (
        <>
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${colors[status]}`}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${colors[status]}`}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </div>
  )
}

interface LiveBadgeProps {
  text: string
}

export function LiveBadge({ text }: LiveBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
      <StatusIndicator status="ok" pulse={false} />
      <span className="text-xs font-medium text-emerald-700">{text}</span>
    </div>
  )
}
