'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, TrendingUp, ExternalLink, BookOpen, Wrench, Rocket, Bot } from 'lucide-react'

interface TrendRepo {
  name: string
  owner: string
  stars: number
  description: string
  url: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
}

const categoryConfig: Record<string, { icon: typeof BookOpen; label: string }> = {
  '📚 学习资源': { icon: BookOpen, label: '学习资源' },
  '🔧 生产级工具': { icon: Wrench, label: '生产工具' },
  '🔧 开发工具': { icon: Wrench, label: '开发工具' },
  '🚀 新兴技术': { icon: Rocket, label: '新兴技术' },
  '🤖 AI Agent': { icon: Bot, label: 'AI Agent' },
  '💡 应用案例': { icon: Rocket, label: '应用案例' },
  '📦 其他': { icon: Wrench, label: '其他' },
}

const difficultyColors = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
}

const difficultyLabels = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
}

export function GitHubTrends() {
  const [repos, setRepos] = useState<TrendRepo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        setRepos(data.repos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const groupedRepos = repos.reduce((acc, repo) => {
    const cat = repo.category || '其他'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(repo)
    return acc
  }, {} as Record<string, TrendRepo[]>)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">GitHub AI Trends</h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span>实时</span>
        </div>
      </div>

      <div className="space-y-5">
        {Object.entries(groupedRepos).map(([category, categoryRepos], catIndex) => {
          const config = categoryConfig[category] || { icon: Rocket, label: category }
          const Icon = config.icon
          
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                {categoryRepos.slice(0, 3).map((repo, index) => (
                  <a
                    key={`${repo.owner}/${repo.name}`}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-w-0"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-mono text-slate-400 truncate">{repo.owner}</span>
                        <span className="text-slate-300 flex-shrink-0">/</span>
                        <span className="font-semibold text-slate-900 group-hover:text-slate-700 truncate">
                          {repo.name}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{repo.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-medium tabular-nums">{repo.stars.toLocaleString()}</span>
                      </div>
                      
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColors[repo.difficulty]}`}>
                        {difficultyLabels[repo.difficulty]}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          基于 github-ai-trends 技能自动获取 · 每日更新
        </p>
      </div>
    </div>
  )
}
