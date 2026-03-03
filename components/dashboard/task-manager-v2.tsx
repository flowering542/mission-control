"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Zap,
  Activity
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
  icon?: React.ReactNode
}

interface TaskManagerProps {
  className?: string
}

// 任务数据
const tasks: Task[] = [
  { 
    id: "daily-brief", 
    name: "每日综合简报", 
    time: "08:00", 
    status: "completed",
    lastRun: "2026-02-26 08:00",
    nextRun: "2026-02-27 08:00",
    successRate: 95,
    icon: <Activity className="h-5 w-5" />,
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
    icon: <Zap className="h-5 w-5" />,
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
    icon: <TrendingUp className="h-5 w-5" />,
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
    icon: <Calendar className="h-5 w-5" />,
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
    icon: <Activity className="h-5 w-5" />,
    history: [
      { timestamp: "2026-02-24 08:00", status: "completed" },
      { timestamp: "2026-02-17 08:00", status: "completed" },
    ]
  },
]

export function TaskManagerV2({ className }: TaskManagerProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "error":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "running":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-emerald-500"
    if (rate >= 80) return "text-amber-500"
    return "text-rose-500"
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 非对称布局标题区 */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            定时任务
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            自动化工作流监控中心
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            正常
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            待执行
          </span>
        </div>
      </div>

      {/* 任务卡片网格 - 非对称布局 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {tasks.map((task, index) => {
          const isSelected = selectedTask === task.id
          const isWide = index === 0 || index === 3
          
          return (
            <div
              key={task.id}
              className={cn(
                "relative group cursor-pointer transition-all duration-300",
                isWide ? "md:col-span-7" : "md:col-span-5"
              )}
              onClick={() => setSelectedTask(isSelected ? null : task.id)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                  getStatusColor(task.status),
                  isSelected && "ring-2 ring-zinc-900/5 shadow-xl"
                )}
              >
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-100 to-transparent rounded-bl-full opacity-50" />
                
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl bg-white/80 shadow-sm",
                      "group-hover:shadow-md transition-shadow"
                    )}>
                      {task.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-900 text-sm">
                        {task.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {task.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {task.successRate && (
                      <div className={cn(
                        "text-lg font-semibold tabular-nums",
                        getSuccessRateColor(task.successRate)
                      )}>
                        {task.successRate}%
                      </div>
                    )}
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      成功率
                    </p>
                  </div>
                </div>

                {/* 展开的历史记录 */}
                {isSelected && (
                  <div className="pt-4 mt-4 border-t border-zinc-100 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                      执行历史
                    </p>
                    <div className="space-y-2">
                      {task.history.slice(0, 3).map((record, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-zinc-50/50"
                        >
                          <div className="flex items-center gap-2">
                            {record.status === "completed" ? (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                            )}
                            <span className="text-xs text-zinc-600">
                              {record.timestamp}
                            </span>
                          </div>
                          {record.message && (
                            <span className="text-xs text-rose-500">
                              {record.message}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 状态指示器 */}
                <div className="absolute bottom-3 right-3">
                  {task.status === "running" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 底部统计 */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-semibold text-zinc-900">{tasks.length}</p>
            <p className="text-xs text-zinc-500">总任务</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600">
              {tasks.filter(t => t.status === "completed").length}
            </p>
            <p className="text-xs text-zinc-500">今日完成</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-600">
              {tasks.filter(t => t.status === "pending").length}
            </p>
            <p className="text-xs text-zinc-500">待执行</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-zinc-400">
            下次执行: {tasks.find(t => t.status === "pending")?.nextRun || "无"}
          </p>
        </div>
      </div>
    </div>
  )
}
