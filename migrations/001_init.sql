-- migrations/001_init.sql
-- 任务执行记录表
CREATE TABLE IF NOT EXISTS task_executions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'degraded')),
  duration INTEGER DEFAULT 0,
  message TEXT,
  timestamp INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_name ON task_executions(task_name);
CREATE INDEX IF NOT EXISTS idx_timestamp ON task_executions(timestamp);
CREATE INDEX IF NOT EXISTS idx_task_time ON task_executions(task_name, timestamp);
