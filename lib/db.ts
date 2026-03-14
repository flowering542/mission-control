import Database from 'better-sqlite3'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

const DB_PATH = join(process.cwd(), 'data', 'tasks.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    migrate()
  }
  return db
}

function migrate() {
  const migrationFiles = [
    join(process.cwd(), 'migrations', '001_init.sql'),
    join(process.cwd(), 'migrations', '002_task_meta.sql')
  ]
  
  for (const filePath of migrationFiles) {
    if (existsSync(filePath)) {
      const sql = readFileSync(filePath, 'utf-8')
      db!.exec(sql)
    }
  }
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}

export function cleanupOldData(days: number = 30) {
  const db = getDb()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  db.prepare('DELETE FROM task_executions WHERE timestamp < ?').run(cutoff)
}
