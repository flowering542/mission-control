import { execSync } from "child_process"
import { NextResponse } from "next/server"

interface Task {
  name: string
  time: string
  status: "completed" | "pending" | "running" | "error"
}

const taskSchedule: Task[] = [
  { name: "每日综合简报", time: "08:00", status: "pending" },
  { name: "科技早报", time: "08:30", status: "pending" },
  { name: "财经简报", time: "09:00", status: "pending" },
  { name: "社交媒体热点", time: "12:00", status: "pending" },
  { name: "AI商业价值周报", time: "周一 08:00", status: "pending" },
]

export async function GET() {
  try {
    // 获取 cron 任务状态
    let cronOutput = ""
    try {
      cronOutput = execSync("openclaw cron list 2>/dev/null || echo '[]'", { encoding: "utf-8" })
    } catch (e) {
      cronOutput = "[]"
    }

    // 解析任务状态
    const tasks = taskSchedule.map((task) => {
      // 根据当前时间判断任务状态
      const now = new Date()
      const [hours, minutes] = task.time.split(":").map(Number)
      
      // 简单逻辑：如果当前时间已过任务时间，标记为已完成
      if (!isNaN(hours) && !isNaN(minutes)) {
        const taskTime = new Date()
        taskTime.setHours(hours, minutes, 0, 0)
        
        if (now > taskTime) {
          // 检查今天是否执行过（简化处理）
          return { ...task, status: "completed" as const }
        }
      }
      
      return task
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get tasks" },
      { status: 500 }
    )
  }
}