import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { TaskService } from '@/lib/task-service'

export async function GET() {
  try {
    // 获取定时任务列表
    const output = execSync('openclaw cron list --json', { 
      encoding: 'utf-8',
      timeout: 10000 
    })
    
    const data = JSON.parse(output)
    const recentExecutions = TaskService.getAllRecentExecutions()
    
    const cronJobs = await Promise.all(
      (data.jobs || []).map(async (job: any) => {
        const stats = TaskService.getTaskStats(job.name)
        const history = TaskService.getTaskHistory(job.name, 10)
        const meta = TaskService.getTaskMeta(job.name)
        const lastExecution = recentExecutions.get(job.name)
        const consecutiveFailures = TaskService.getConsecutiveFailures(job.name)
        
        return {
          id: job.id,
          name: job.name,
          displayName: meta?.displayName || job.name,
          category: meta?.category || 'unknown',
          description: meta?.description || '',
          icon: meta?.icon || 'circle',
          priority: meta?.priority || 5,
          schedule: job.schedule?.expr || 'unknown',
          next: formatTime(job.state?.nextRunAtMs),
          last: formatTime(job.state?.lastRunAtMs),
          status: getStatus(job, lastExecution, consecutiveFailures, meta),
          stats,
          history,
          consecutiveFailures
        }
      })
    )

    return NextResponse.json({ cronJobs })
  } catch (error) {
    console.error('Error fetching cron jobs:', error)
    return NextResponse.json(
      { cronJobs: [], error: 'Failed to fetch cron jobs' },
      { status: 500 }
    )
  }
}

function formatTime(timestampMs?: number): string {
  if (!timestampMs) return '--'
  const diff = timestampMs - Date.now()
  const mins = Math.floor(diff / 60000)
  if (mins < 0) return '刚刚'
  if (mins < 60) return `${mins}分钟后`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时后`
  return new Date(timestampMs).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatus(
  job: any, 
  lastExecution?: any, 
  consecutiveFailures?: number,
  meta?: any
): 'ok' | 'error' | 'warning' | 'running' | 'idle' | 'critical' {
  // 连续失败超过阈值
  if (consecutiveFailures && meta && consecutiveFailures >= meta.alertThreshold) {
    return 'critical'
  }
  
  if (job.state?.lastStatus === 'running') return 'running'
  if (lastExecution?.status === 'failed') return 'error'
  if (lastExecution?.status === 'degraded') return 'warning'
  if (job.state?.lastStatus === 'ok') return 'ok'
  return 'idle'
}
