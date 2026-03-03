"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Wrench, FileText } from "lucide-react"

interface DashboardData {
  skills: string[]
  latestBriefing: string
  updatedAt: string
}

interface DashboardInfoProps {
  className?: string
}

export function DashboardInfo({ className }: DashboardInfoProps) {
  const [data, setData] = useState<DashboardData>({
    skills: [],
    latestBriefing: "",
    updatedAt: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // 每60秒刷新
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {/* 技能列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            技能列表
            <Badge variant="secondary" className="ml-auto">
              {data.skills.length} 个
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          {data.updatedAt && (
            <p className="text-xs text-muted-foreground mt-4">
              更新于: {new Date(data.updatedAt).toLocaleString("zh-CN")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 最新简报 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            最新简报
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
            {data.latestBriefing || "暂无简报"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}