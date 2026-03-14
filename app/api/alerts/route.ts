import { NextResponse } from 'next/server'
import { TaskService } from '@/lib/task-service'

export async function GET() {
  try {
    const alerts = TaskService.getAlerts()
    
    // 补充任务元数据
    const enrichedAlerts = alerts.map(alert => {
      const meta = TaskService.getTaskMeta(alert.taskName)
      return {
        ...alert,
        displayName: meta?.displayName || alert.taskName,
        priority: meta?.priority || 5
      }
    })

    return NextResponse.json({ alerts: enrichedAlerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ alerts: [] })
  }
}
