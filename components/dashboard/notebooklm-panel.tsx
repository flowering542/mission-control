"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  ExternalLink,
  Headphones, 
  Video, 
  Presentation,
  Map,
  CheckCircle
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notebook {
  id: string
  title: string
  source_count: number
  updated_at: string
  artifacts?: Artifact[]
}

interface Artifact {
  id: string
  type: "audio" | "video" | "slides" | "infographic" | "mindmap"
  status: "in_progress" | "completed" | "failed"
}

interface NotebookLMProps {
  className?: string
}

const artifactIcons = {
  audio: Headphones,
  video: Video,
  slides: Presentation,
  infographic: Map,
  mindmap: Map,
}

const artifactLabels = {
  audio: "播客",
  video: "视频",
  slides: "幻灯片",
  infographic: "信息图",
  mindmap: "思维导图",
}

// 静态数据
const staticNotebooks: Notebook[] = [
  {
    id: "e8c7f163-01e5-4bc2-9699-742f34826210",
    title: "OpenClaw 学习笔记",
    source_count: 1,
    updated_at: "2026-02-26T14:12:33Z",
    artifacts: [
      { id: "1", type: "audio", status: "completed" },
      { id: "2", type: "infographic", status: "completed" },
    ]
  },
  {
    id: "f6199181-99d1-4031-9a13-66b8505ee3cd",
    title: "AI 编程分享",
    source_count: 2,
    updated_at: "2026-02-26T14:05:27Z",
  },
  {
    id: "5e3eefd1-4ed8-48f6-aa15-500a502b0c08",
    title: "LLM AI Agents",
    source_count: 5,
    updated_at: "2026-02-09T07:08:07Z",
  },
]

export function NotebookLMPanel({ className }: NotebookLMProps) {
  const [notebooks] = useState<Notebook[]>(staticNotebooks)

  const openNotebookLM = (notebookId: string) => {
    window.open(`https://notebooklm.google.com/notebook/${notebookId}`, "_blank")
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          NotebookLM 笔记本
        </CardTitle>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => window.open("https://notebooklm.google.com", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          打开 NotebookLM
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {notebooks.map((notebook) => (
              <div key={notebook.id} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{notebook.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {notebook.source_count} 个来源 · 更新于 {new Date(notebook.updated_at).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openNotebookLM(notebook.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    打开
                  </Button>
                </div>

                {/* 已生成的内容 */}
                {notebook.artifacts && notebook.artifacts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {notebook.artifacts.map((artifact) => {
                      const Icon = artifactIcons[artifact.type]
                      return (
                        <div
                          key={artifact.id}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{artifactLabels[artifact.type]}</span>
                          <CheckCircle className="h-3 w-3" />
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 生成按钮 - 跳转到 NotebookLM */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(artifactIcons).map(([type, Icon]) => (
                    <Button
                      key={type}
                      size="sm"
                      variant="outline"
                      onClick={() => openNotebookLM(notebook.id)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      生成{artifactLabels[type as keyof typeof artifactLabels]}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
