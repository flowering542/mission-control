'use client'

import { motion } from 'framer-motion'
import { 
  Terminal, 
  FileText, 
  Cloud, 
  Settings,
  ArrowUpRight 
} from 'lucide-react'

const actions = [
  {
    icon: Terminal,
    label: '运行脚本',
    description: '执行自定义命令',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: FileText,
    label: '查看日志',
    description: '系统运行日志',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Cloud,
    label: '代理设置',
    description: 'Mihomo 配置',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Settings,
    label: '系统设置',
    description: '偏好配置',
    color: 'bg-slate-50 text-slate-600',
  },
]

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">快捷操作</h2>
        <p className="text-sm text-slate-500 mt-1">常用功能入口</p>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
            >
              <div className={`p-2.5 rounded-xl ${action.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
