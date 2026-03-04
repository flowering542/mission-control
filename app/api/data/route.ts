import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // 读取数据文件 - 使用绝对路径
    const dataPath = '/root/.openclaw/workspace/mission-control/data/daily-data.json'
    
    // 如果文件不存在，返回默认数据
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        cron_jobs: [],
        system: {
          disk_usage: 60,
          memory_usage: 45,
          health_score: 96
        },
        today_stats: {
          success: 0,
          failed: 0
        }
      })
    }
    
    // 读取并解析 JSON
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    )
  }
}
