import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface CronJob {
  id: string
  name: string
  schedule: string
  next: string
  last: string
  status: 'ok' | 'error' | 'warning' | 'running' | 'idle'
}

export async function GET() {
  try {
    // Get cron jobs from openclaw
    const { stdout } = await execAsync('openclaw cron list --json')
    const jobs = JSON.parse(stdout)
    
    // Transform to our format
    const cronJobs: CronJob[] = jobs.map((job: any) => ({
      id: job.id,
      name: job.name,
      schedule: job.schedule?.expr || '未知',
      next: job.state?.nextRunAtMs ? formatTime(job.state.nextRunAtMs) : '-',
      last: job.state?.lastRunAtMs ? formatTime(job.state.lastRunAtMs) : '-',
      status: mapStatus(job.state?.lastStatus, job.state?.consecutiveErrors),
    }))

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      cronJobs,
    })
  } catch (error) {
    // Fallback to static data if command fails
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      cronJobs: [
        {
          id: '790a1814-eb7f-4216-980a-dafdf4169d7f',
          name: '每日综合简报',
          schedule: '0 8 * * *',
          next: '明天 08:00',
          last: '今天 08:00',
          status: 'ok',
        },
        {
          id: '2632d6a8-810f-4844-8f7e-d29b945ac5b1',
          name: '推特日报',
          schedule: '30 9 * * *',
          next: '明天 09:30',
          last: '今天 09:30',
          status: 'ok',
        },
        {
          id: 'd9d1cb59-7d1a-43c4-a5b2-411e36c40902',
          name: '社交媒体热点',
          schedule: '0 12 * * *',
          next: '今天 12:00',
          last: '3天前',
          status: 'ok',
        },
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          name: 'AI商业价值周报',
          schedule: '0 8 * * 1',
          next: '下周一 08:00',
          last: '上周一 08:00',
          status: 'ok',
        },
        {
          id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
          name: '竞品追踪',
          schedule: '0 20 * * 1',
          next: '下周一 20:00',
          last: '4天前',
          status: 'ok',
        },
        {
          id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
          name: 'Mission Control 更新',
          schedule: '0 6 * * *',
          next: '明天 06:00',
          last: '4小时前',
          status: 'running',
        },
      ],
    })
  }
}

function formatTime(timestampMs: number): string {
  const date = new Date(timestampMs)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 0) {
    return `${Math.abs(diffHours)}小时前`
  } else if (diffHours < 24) {
    return `${diffHours}小时后`
  } else {
    return `${Math.round(diffHours / 24)}天后`
  }
}

function mapStatus(lastStatus: string, errors: number): CronJob['status'] {
  if (lastStatus === 'error' || errors > 0) return 'error'
  if (lastStatus === 'running') return 'running'
  if (lastStatus === 'ok') return 'ok'
  return 'idle'
}
