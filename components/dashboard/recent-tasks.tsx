"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface Task {
  name: string
  time: string
  status: "completed" | "pending" | "running" | "error"
  lastRun?: string
}

interface RecentTasksProps {
  className?: string
}

export function RecentTasks({ className }: RecentTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { name: "每日综合简报", time: "08:00", status: "pending" },
    { name: "科技早报", time: "08:30", status: "pending" },
    { name: "财经简报", time: "09:00", status: "pending" },
    { name: "社交媒体热点", time: "12:00", status: "pending" },
    { name: "AI商业价值周报", time: "周一 08:00", status: "pending" },
  ])

  useEffect(() => {
    // 获取任务状态
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks")
        if (res.ok) {
          const data = await res.json()
          if (data.tasks) {
            setTasks(data.tasks)
          }
        }
      } catch (e) {
        console.error("Failed to fetch tasks", e)
      }
    }

    fetchTasks()
    const interval = setInterval(fetchTasks, 60000) // 每分钟刷新
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">已完成</Badge>
      case "error":
        return <Badge variant="destructive">失败</Badge>
      case "running":
        return <Badge variant="default" className="bg-blue-500">运行中</Badge>
      default:
        return <Badge variant="secondary">待执行</Badge>
    }
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>今日任务</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <div>
                  <p className="text-sm font-medium">{task.name}</p>
                  <p className="text-xs text-muted-foreground">{task.time}</p>
                </div>
              </div>
              {getStatusBadge(task.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
