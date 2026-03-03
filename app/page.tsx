import { Metadata } from "next"
import { DashboardContent } from "./dashboard-content"

export const metadata: Metadata = {
  title: "Mission Control | OpenClaw Dashboard",
  description: "自动化工作流监控中心",
}

export default function DashboardPage() {
  return <DashboardContent />
}
