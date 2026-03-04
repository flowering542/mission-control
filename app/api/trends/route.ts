import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'
import { join } from 'path'

const execAsync = promisify(exec)

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

// Parse the markdown report to extract trending repos
function parseTrendsReport(content: string): TrendRepo[] {
  const repos: TrendRepo[] = []
  const lines = content.split('\n')
  
  let currentCategory = ''
  
  for (const line of lines) {
    // Detect category
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim()
      continue
    }
    
    // Parse repo entry
    const repoMatch = line.match(/📦 \*\*(\w+)\/(\w+)\*\*/)
    const starsMatch = line.match(/⭐ ([\d,]+)/)
    const descMatch = line.match(/\s{3}(.+)$/)
    const urlMatch = line.match(/🔗 (https:\/\/github\.com\/.+)/)
    const langMatch = line.match(/📝 (\w+)/)
    
    if (repoMatch && starsMatch) {
      const difficulty = line.includes('🟢') ? 'beginner' : 
                        line.includes('🟡') ? 'intermediate' : 'advanced'
      
      repos.push({
        owner: repoMatch[1],
        name: repoMatch[2],
        stars: parseInt(starsMatch[1].replace(/,/g, '')),
        description: descMatch?.[1] || '',
        url: urlMatch?.[1] || `https://github.com/${repoMatch[1]}/${repoMatch[2]}`,
        category: currentCategory,
        difficulty,
        language: langMatch?.[1] || 'Unknown',
      })
    }
  }
  
  return repos.slice(0, 12) // Return top 12
}

export async function GET() {
  try {
    // Try to read existing report first
    const reportPath = '/root/.openclaw/workspace/skills/github-ai-trends/reports/' + `detailed-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.md`
    
    let repos: TrendRepo[] = []
    
    try {
      const content = await readFile(reportPath, 'utf-8')
      repos = parseTrendsReport(content)
    } catch {
      // If no report exists, return fallback data
      repos = [
        {
          name: 'wifi-densepose',
          owner: 'ruvnet',
          stars: 22152,
          description: 'WiFi信号实时人体姿态估计，无需摄像头',
          url: 'https://github.com/ruvnet/wifi-densepose',
          category: '🚀 新兴技术',
          difficulty: 'advanced',
          language: 'Python',
        },
        {
          name: 'airi',
          owner: 'moeru-ai',
          stars: 21441,
          description: '自托管 AI 伴侣，支持实时语音、Minecraft/Factorio',
          url: 'https://github.com/moeru-ai/airi',
          category: '🚀 新兴技术',
          difficulty: 'intermediate',
          language: 'TypeScript',
        },
        {
          name: 'taste-skill',
          owner: 'Leonxlnx',
          stars: 1857,
          description: '让 AI 拥有好品味，停止生成丑陋前端',
          url: 'https://github.com/Leonxlnx/taste-skill',
          category: '🤖 AI Agent',
          difficulty: 'advanced',
          language: 'Unknown',
        },
      ]
    }
    
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      repos,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
