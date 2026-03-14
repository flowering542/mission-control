'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, AlertTriangle, X } from 'lucide-react'

interface Alert {
  taskName: string
  displayName: string
  status: 'failed' | 'degraded'
  message?: string
  timestamp: number
  priority: number
}

export function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts')
        const data = await res.json()
        setAlerts(data.alerts || [])
      } catch (e) {
        console.error('Failed to fetch alerts:', e)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000) // 30秒轮询
    return () => clearInterval(interval)
  }, [])

  const activeAlerts = alerts.filter(a => !dismissed.has(`${a.taskName}-${a.timestamp}`))

  if (activeAlerts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <motion.div
            key={`${alert.taskName}-${alert.timestamp}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border ${
              alert.status === 'failed'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {alert.status === 'failed' ? (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{alert.displayName}</p>
              <p className="text-sm opacity-80 truncate">
                {alert.status === 'failed' ? '执行失败' : '使用了降级策略'}
              </p>
              {alert.message && (
                <p className="text-xs opacity-60 mt-1 truncate">{alert.message}</p>
              )}
            </div>
            <button
              onClick={() => {
                setDismissed(new Set([...dismissed, `${alert.taskName}-${alert.timestamp}`]))
              }}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
