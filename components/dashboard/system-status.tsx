"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, Cpu, HardDrive, MemoryStick } from "lucide-react"

interface SystemInfo {
  name: string
  status: "online" | "offline"
  value?: string
}

interface SystemStatusProps {
  className?: string
}

export function SystemStatus({ className }: SystemStatusProps) {
  const [systems, setSystems] = useState<SystemInfo[]>([
    { name: "OpenClaw Gateway", status: "online" },
    { name: "Mihomo Proxy", status: "online" },
    { name: "Cron Scheduler", status: "online" },
  ])
  const [metrics, setMetrics] = useState({
    cpu: "--",
    memory: "--",
    disk: "--",
  })

  useEffect(() => {
    // 获取系统状态
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/system")
        if (res.ok) {
          const data = await res.json()
          setMetrics({
            cpu: data.cpu || "--",
            memory: data.memory || "--",
            disk: data.disk || "--",
          })
          setSystems(prev => prev.map(s => ({
            ...s,
            status: data[s.name.toLowerCase().replace(/\s+/g, "_")] || "online"
          })))
        }
      } catch (e) {
        console.error("Failed to fetch system status", e)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // 每30秒刷新
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>系统状态</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 系统服务状态 */}
          {systems.map((system) => (
            <div key={system.name} className="flex items-center justify-between">
              <span className="text-sm">{system.name}</span>
              <div className="flex items-center gap-2">
                {system.status === "online" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      正常
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      异常
                    </Badge>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* 系统资源 */}
          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground mb-3">服务器资源</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <Cpu className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-muted-foreground">CPU</p>
                <p className="text-sm font-medium">{metrics.cpu}</p>
              </div>
              <div className="text-center">
                <MemoryStick className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                <p className="text-xs text-muted-foreground">内存</p>
                <p className="text-sm font-medium">{metrics.memory}</p>
              </div>
              <div className="text-center">
                <HardDrive className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-muted-foreground">磁盘</p>
                <p className="text-sm font-medium">{metrics.disk}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
