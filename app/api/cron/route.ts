import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    // 获取定时任务列表
    const output = execSync('openclaw cron list --json', { 
      encoding: 'utf-8',
      timeout: 10000 
    })
    
    const data = JSON.parse(output)
    const cronJobs = data.jobs?.map((job: any) => ({
      id: job.id,
      name: job.name,
      schedule: job.schedule?.expr || 'unknown',
      next: job.state?.nextRunAtMs ? formatTime(job.state.nextRunAtMs) : '--',
      last: job.state?.lastRunAtMs ? formatTime(job.state.lastRunAtMs) : '--',
      status: getStatus(job)
    })) || []

    return NextResponse.json({ cronJobs })
  } catch (error) {
    console.error('Error fetching cron jobs:', error)
    return NextResponse.json(
      { cronJobs: [], error: 'Failed to fetch cron jobs' },
      { status: 500 }
    )
  }
}

function formatTime(timestampMs: number): string {
  const date = new Date(timestampMs)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 0) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟后`
  } else if (diffHours < 24) {
    return `${diffHours}小时后`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}

function getStatus(job: any): 'ok' | 'error' | 'warning' | 'running' | 'idle' {
  if (job.state?.lastStatus === 'error') return 'error'
  if (job.state?.lastStatus === 'running') return 'running'
  if (job.state?.lastStatus === 'ok') return 'ok'
  return 'idle'
}
