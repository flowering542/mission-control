import { NextResponse } from 'next/server'
import { TaskService } from '@/lib/task-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.taskName || !body.status) {
      return NextResponse.json(
        { error: 'Missing taskName or status' },
        { status: 400 }
      )
    }

    if (!['success', 'failed', 'degraded'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    TaskService.recordExecution({
      taskName: body.taskName,
      status: body.status,
      duration: body.duration || 0,
      message: body.message || '',
      timestamp: body.timestamp || Date.now()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording task execution:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
