import { getDb } from './db'

export interface TaskExecution {
  id?: number
  taskName: string
  status: 'success' | 'failed' | 'degraded'
  duration: number
  message?: string
  timestamp: number
}

export interface TaskStats {
  total: number
  success: number
  failed: number
  degraded: number
  successRate: number
  avgDuration: number
  lastExecution?: TaskExecution
}

export interface TaskMeta {
  taskName: string
  displayName: string
  category: string
  description?: string
  icon?: string
  priority: number
  expectedDuration: number
  alertThreshold: number
}

export class TaskService {
  // 记录执行
  static recordExecution(data: TaskExecution) {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO task_executions (task_name, status, duration, message, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `)
    return stmt.run(data.taskName, data.status, data.duration, data.message || '', data.timestamp)
  }

  // 获取任务统计（最近7天）
  static getTaskStats(taskName: string): TaskStats {
    const db = getDb()
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
    
    const rows = db.prepare(`
      SELECT status, duration FROM task_executions 
      WHERE task_name = ? AND timestamp > ?
      ORDER BY timestamp DESC
    `).all(taskName, cutoff) as any[]

    if (rows.length === 0) {
      return { total: 0, success: 0, failed: 0, degraded: 0, successRate: 0, avgDuration: 0 }
    }

    const total = rows.length
    const success = rows.filter(r => r.status === 'success').length
    const failed = rows.filter(r => r.status === 'failed').length
    const degraded = rows.filter(r => r.status === 'degraded').length
    const avgDuration = Math.round(rows.reduce((sum, r) => sum + r.duration, 0) / total)

    return {
      total,
      success,
      failed,
      degraded,
      successRate: Math.round((success / total) * 100),
      avgDuration
    }
  }

  // 获取任务历史
  static getTaskHistory(taskName: string, limit: number = 10): TaskExecution[] {
    const db = getDb()
    return db.prepare(`
      SELECT * FROM task_executions 
      WHERE task_name = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(taskName, limit) as TaskExecution[]
  }

  // 获取任务元数据
  static getTaskMeta(taskName: string): TaskMeta | null {
    const db = getDb()
    const row = db.prepare('SELECT * FROM task_meta WHERE task_name = ?').get(taskName) as any
    if (!row) return null
    
    return {
      taskName: row.task_name,
      displayName: row.display_name,
      category: row.category,
      description: row.description,
      icon: row.icon,
      priority: row.priority,
      expectedDuration: row.expected_duration,
      alertThreshold: row.alert_threshold
    }
  }

  // 获取所有任务元数据
  static getAllTaskMeta(): TaskMeta[] {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM task_meta ORDER BY priority DESC').all() as any[]
    
    return rows.map(row => ({
      taskName: row.task_name,
      displayName: row.display_name,
      category: row.category,
      description: row.description,
      icon: row.icon,
      priority: row.priority,
      expectedDuration: row.expected_duration,
      alertThreshold: row.alert_threshold
    }))
  }

  // 获取所有任务的最近执行
  static getAllRecentExecutions(): Map<string, TaskExecution> {
    const db = getDb()
    const rows = db.prepare(`
      SELECT te.* FROM task_executions te
      INNER JOIN (
        SELECT task_name, MAX(timestamp) as max_ts
        FROM task_executions
        GROUP BY task_name
      ) latest ON te.task_name = latest.task_name AND te.timestamp = latest.max_ts
    `).all() as TaskExecution[]

    return new Map(rows.map(r => [r.taskName, r]))
  }

  // 获取告警
  static getAlerts(since: number = Date.now() - 24 * 60 * 60 * 1000): TaskExecution[] {
    const db = getDb()
    return db.prepare(`
      SELECT * FROM task_executions 
      WHERE status IN ('failed', 'degraded') 
      AND timestamp > ?
      ORDER BY timestamp DESC
      LIMIT 10
    `).all(since) as TaskExecution[]
  }

  // 获取连续失败次数
  static getConsecutiveFailures(taskName: string): number {
    const db = getDb()
    const rows = db.prepare(`
      SELECT status FROM task_executions 
      WHERE task_name = ?
      ORDER BY timestamp DESC
      LIMIT 10
    `).all(taskName) as any[]

    let count = 0
    for (const row of rows) {
      if (row.status === 'failed') {
        count++
      } else {
        break
      }
    }
    return count
  }
}
