"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  ChevronUp,
  Calendar,
  XCircle
} from "lucide-react"

interface TaskHistory {
  timestamp: string
  status: "completed" | "error"
  message?: string
}

interface Task {
  id: string
  name: string
  time: string
  status: "completed" | "pending" | "running" | "error"
  lastRun?: string
  nextRun?: string
  successRate?: number
  history: TaskHistory[]
}

interface TaskManagerProps {
  className?: string
}

// 静态任务数据（包含执行历史）
const tasks: Task[] = [
  { 
    id: "daily-brief", 
    name: "每日综合简报", 
    time: "08:00", 
    status: "completed",
    lastRun: "2026-02-26 08:00",
    nextRun: "2026-02-27 08:00",
    successRate: 95,
    history: [
      { timestamp: "2026-02-26 08:00", status: "completed" },
      { timestamp: "2026-02-25 08:00", status: "completed" },
      { timestamp: "2026-02-24 08:00", status: "completed" },
      { timestamp: "2026-02-23 08:00", status: "error", message: "网络超时" },
      { timestamp: "2026-02-22 08:00", status: "completed" },
    ]
  },
  { 
    id: "tech-news", 
    name: "科技早报", 
    time: "08:30", 
    status: "completed",
    lastRun: "2026-02-26 08:30",
    nextRun: "2026-02-27 08:30",
    successRate: 98,
    history: [
      { timestamp: "2026-02-26 08:30", status: "completed" },
      { timestamp: "2026-02-25 08:30", status: "completed" },
      { timestamp: "2026-02-24 08:30", status: "completed" },
    ]
  },
  { 
    id: "finance-brief", 
    name: "财经简报", 
    time: "09:00", 
    status: "completed",
    lastRun: "2026-02-26 09:00",
    nextRun: "2026-02-27 09:00",
    successRate: 92,
    history: [
      { timestamp: "2026-02-26 09:00", status: "completed" },
      { timestamp: "2026-02-25 09:00", status: "error", message: "消息过长" },
      { timestamp: "2026-02-24 09:00", status: "completed" },
    ]
  },
  { 
    id: "social-hot", 
    name: "社交媒体热点", 
    time: "12:00", 
    status: "pending",
    nextRun: "2026-02-27 12:00",
    successRate: 96,
    history: [
      { timestamp: "2026-02-25 12:00", status: "completed" },
      { timestamp: "2026-02-24 12:00", status: "completed" },
    ]
  },
  { 
    id: "ai-weekly", 
    name: "AI商业价值周报", 
    time: "周一 08:00", 
    status: "pending",
    nextRun: "2026-03-02 08:00",
    successRate: 100,
    history: [
      { timestamp: "2026-02-24 08:00", status: "completed" },
      { timestamp: "2026-02-17 08:00", status: "completed" },
    ]
  },
]

export function TaskManager({ className }: TaskManagerProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const toggleExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId)
  }

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

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-500"
    if (rate >= 80) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>定时任务管理</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>点击任务查看执行历史</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-lg border overflow-hidden">
              {/* 任务头部 - 可点击展开 */}
              <div 
                className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => toggleExpand(task.id)}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="text-sm font-medium">{task.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>定时: {task.time}</span>
                      {task.nextRun && (
                        <span className="text-blue-500">下次: {task.nextRun}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.successRate && (
                    <span className={`text-xs font-medium ${getSuccessRateColor(task.successRate)}`}>
                      {task.successRate}% 成功率
                    </span>
                  )}
                  {getStatusBadge(task.status)}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      toggleExpand(task.id)
                    }}
                  >
                    {expandedTask === task.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 展开的执行历史 */}
              {expandedTask === task.id && (
                <div className="border-t bg-muted/30 px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">最近执行记录</p>
                  <div className="space-y-1">
                    {task.history.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 px-2 rounded text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {record.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className="text-xs">{record.timestamp}</span>
                        </div>
                        {record.message && (
                          <span className="text-xs text-red-500">{record.message}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
