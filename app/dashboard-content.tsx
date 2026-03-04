'use client'

import { useState, useEffect } from 'react'
import { useSystemData } from "@/hooks/use-system-data"
import { CronJobsPanel } from "@/components/dashboard/cron-jobs-panel"
import { SystemMetrics } from "@/components/dashboard/system-metrics"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { GitHubTrends } from "@/components/dashboard/github-trends"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { LiveBadge } from "@/components/ui/animated-elements"

function ClientDate({ timestamp }: { timestamp?: string }) {
  const [date, setDate] = useState('')
  
  useEffect(() => {
    if (timestamp) {
      setDate(new Date(timestamp).toLocaleString('zh-CN'))
    } else {
      setDate(new Date().toLocaleString('zh-CN'))
    }
  }, [timestamp])
  
  return <p className="font-mono">Last updated: {date || '--'}</p>
}

export function DashboardContent() {
  const { data, loading, error } = useSystemData()
  
  // 计算活跃任务数
  const activeJobs = data?.cron_jobs?.length || 0
  
  // 获取健康度
  const healthScore = data?.system?.health_score || 96
  
  // 获取今日统计
  const todaySuccess = data?.today_stats?.success || 0
  const todayFailed = data?.today_stats?.failed || 0
  
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <header className="relative bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LiveBadge text={loading ? "加载中..." : error ? "数据异常" : "系统运行中"} />
                <span className="text-xs text-slate-400 font-mono">v2.1.0</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">Mission Control</h1>
              <p className="text-base text-slate-500 max-w-lg leading-relaxed">
                OpenClaw 自动化工作流监控中心。实时追踪任务状态、系统资源与 AI 趋势。
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-4xl font-semibold text-slate-900 tabular-nums">
                  {loading ? '--' : `${healthScore}%`}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">系统健康度</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-right">
                <p className="text-4xl font-semibold text-emerald-600 tabular-nums">
                  {loading ? '--' : activeJobs}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">活跃任务</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-right">
                <p className="text-4xl font-semibold text-blue-600 tabular-nums">
                  {loading ? '--' : todaySuccess}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">今日成功</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <BentoGrid>
          <BentoCard colSpan={2} rowSpan={2} delay={0}>
            <div className="p-8 h-full">
              <CronJobsPanel jobs={data?.cron_jobs} />
            </div>
          </BentoCard>
          <BentoCard colSpan={1} delay={0.1}>
            <div className="p-6">
              <SystemMetrics />
            </div>
          </BentoCard>
          <BentoCard colSpan={1} delay={0.2}>
            <div className="p-6">
              <QuickActions />
            </div>
          </BentoCard>
          <BentoCard colSpan={2} delay={0.3}>
            <div className="p-6"><GitHubTrends /></div>
          </BentoCard>
        </BentoGrid>

        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>OpenClaw Mission Control © 2026</p>
            <ClientDate timestamp={data?.timestamp} />
          </div>
        </footer>
      </main>
    </div>
  )
}
