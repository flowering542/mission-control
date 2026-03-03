'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react'

interface CronJob {
  id: string
  name: string
  schedule: string
  next: string
  last: string
  status: 'ok' | 'error' | 'warning' | 'running' | 'idle'
}

const statusConfig = {
  ok: { 
    icon: CheckCircle2, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  error: { 
    icon: AlertCircle, 
    color: 'text-rose-500', 
    bg: 'bg-rose-50',
    border: 'border-rose-100'
  },
  running: { 
    icon: Play, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  idle: { 
    icon: Clock, 
    color: 'text-slate-400', 
    bg: 'bg-slate-50',
    border: 'border-slate-100'
  },
  warning: { 
    icon: AlertCircle, 
    color: 'text-amber-500', 
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  },
}

export function CronJobsPanel() {
  const [jobs, setJobs] = useState<CronJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cron')
      .then(res => res.json())
      .then(data => {
        setJobs(data.cronJobs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const runningCount = jobs.filter(j => j.status === 'running' || j.status === 'ok').length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">定时任务</h2>
          <p className="text-sm text-slate-500 mt-1">
            {runningCount} / {jobs.length} 运行中
          </p>
        </div>
        <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
          查看全部
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jobs List */}
      <div className="flex-1 space-y-2">
        {jobs.map((job, index) => {
          const config = statusConfig[job.status] || statusConfig.idle
          const Icon = config.icon

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              {/* Status Icon */}
              <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center border ${config.border}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{job.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {job.schedule}
                </p>
              </div>

              {/* Next Run */}
              <div className="text-right mr-2">
                <p className="text-xs text-slate-400">下次执行</p>
                <p className="text-sm font-medium text-slate-600">{job.next}</p>
              </div>

              {/* Play Button */}
              <button className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                <Play className="w-4 h-4 fill-current" />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
