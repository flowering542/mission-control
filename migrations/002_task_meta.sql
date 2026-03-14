-- migrations/002_task_meta.sql
-- 任务元数据表
CREATE TABLE IF NOT EXISTS task_meta (
  task_name TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  priority INTEGER DEFAULT 5,
  expected_duration INTEGER,
  alert_threshold INTEGER DEFAULT 3,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始化现有任务元数据
INSERT OR IGNORE INTO task_meta (task_name, display_name, category, description, icon, priority, expected_duration) VALUES
  ('arxiv-daily', '论文速递', 'collection', '每日arXiv AI论文追踪', 'book-open', 8, 30),
  ('daily-briefing', '每日简报', 'collection', '综合信息简报', 'newspaper', 7, 60),
  ('tech-news', '科技早报', 'collection', '科技新闻聚合', 'cpu', 8, 45),
  ('finance-news', '财经简报', 'collection', '财经快讯汇总', 'trending-up', 7, 30),
  ('twitter-daily', 'Twitter日报', 'trends', 'AI大V动态追踪', 'twitter', 6, 120),
  ('social-hot', '社交媒体热点', 'collection', '微博知乎等热点', 'flame', 6, 60),
  ('ai-business-weekly', 'AI商业价值周报', 'trends', 'GitHub AI趋势分析', 'bar-chart-2', 7, 180),
  ('coach-health-check', 'Coach服务健康检查', 'maintenance', '学习辅导服务监控', 'heart-pulse', 5, 10),
  ('qmdr-index-update', 'QMDR索引更新', 'maintenance', '记忆系统索引维护', 'database', 5, 60),
  ('health-check', '健康检查', 'maintenance', '系统健康检查与自动修复', 'activity', 9, 120),
  ('website-data-update', '网站数据更新', 'maintenance', '更新网站展示数据', 'refresh-cw', 6, 60);
