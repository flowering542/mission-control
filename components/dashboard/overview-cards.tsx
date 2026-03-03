"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, Globe, Zap } from "lucide-react"

const cards = [
  {
    title: "Active Tasks",
    value: "5",
    description: "Cron jobs running",
    icon: Clock,
  },
  {
    title: "Proxy Status",
    value: "Online",
    description: "Mihomo running",
    icon: Globe,
  },
  {
    title: "System Load",
    value: "12%",
    description: "CPU usage",
    icon: Activity,
  },
  {
    title: "API Calls",
    value: "1,234",
    description: "Today",
    icon: Zap,
  },
]

export function OverviewCards() {
  return (
    <>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
