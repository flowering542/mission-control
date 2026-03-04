'use client'

import { useState, useEffect } from 'react'

interface SystemData {
  timestamp: string
  date: string
  cron_jobs: any[]
  system: {
    disk_usage: number
    memory_usage: number
    health_score: number
  }
  today_stats: {
    success: number
    failed: number
  }
}

export function useSystemData() {
  const [data, setData] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // 每 5 分钟刷新一次
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}
