'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HardDrive, MemoryStick, Globe, Activity } from 'lucide-react'

interface SystemData {
  disk?: string
  memory?: string
  cpu?: string
  uptime?: string
  system?: {
    disk?: string
    memory?: string
    cpu?: string
    uptime?: string
  }
  proxy?: {
    status?: string
    responseCode?: number
  }
}

export function SystemMetrics() {
  const [data, setData] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/system')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Safe data extraction with fallbacks - handle nested system object
  const system = data?.system || data || {}
  const diskStr = system?.disk || '0%'
  const memoryStr = system?.memory || '0/0'
  const uptimeStr = system?.uptime || ''
  const proxyStatus = data?.proxy?.status || 'unknown'
  const proxyCode = data?.proxy?.responseCode || 0

  const diskValue = parseInt(diskStr.replace('%', '')) || 0
  const memParts = memoryStr.split('/')
  const memUsed = memParts[0] || '0'
  const memTotal = memParts[1] || '0'
  const uptimeDisplay = uptimeStr.replace('up ', '').replace(/,/g, '') || 'N/A'

  const metrics = [
    {
      icon: Globe,
      label: '代理状态',
      value: proxyStatus === 'ok' ? '正常' : '异常',
      subValue: proxyCode > 0 ? `HTTP ${proxyCode}` : '',
      color: proxyStatus === 'ok' ? 'text-emerald-600' : 'text-rose-600',
      barColor: proxyStatus === 'ok' ? 'bg-emerald-500' : 'bg-rose-500',
      progress: proxyStatus === 'ok' ? 100 : 0,
    },
    {
      icon: HardDrive,
      label: '磁盘使用',
      value: `${diskValue}%`,
      subValue: diskStr,
      color: diskValue > 80 ? 'text-rose-600' : 'text-emerald-600',
      barColor: diskValue > 80 ? 'bg-rose-500' : 'bg-emerald-500',
      progress: diskValue,
    },
    {
      icon: MemoryStick,
      label: '内存使用',
      value: memUsed,
      subValue: `总计 ${memTotal}`,
      color: 'text-blue-600',
      barColor: 'bg-blue-500',
      progress: 45,
    },
    {
      icon: Activity,
      label: '运行时长',
      value: uptimeDisplay,
      subValue: '',
      color: 'text-slate-600',
      barColor: 'bg-slate-400',
      progress: 100,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">系统状态</h2>
        <p className="text-sm text-slate-500 mt-1">实时监控</p>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{metric.label}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${metric.color}`}>
                    {metric.value}
                  </span>
                  {metric.subValue && (
                    <span className="text-xs text-slate-400 ml-1">{metric.subValue}</span>
                  )}
                </div>
              </div>
              
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metric.progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className={`h-full rounded-full ${metric.barColor}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
