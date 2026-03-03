import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    const dashboardPath = join(process.cwd(), "public", "data", "dashboard.json")
    const data = JSON.parse(readFileSync(dashboardPath, "utf-8"))
    
    return NextResponse.json({
      skills: data.skills || [],
      latestBriefing: data.latestBriefing || "",
      updatedAt: data.updatedAt || "",
    })
  } catch (error) {
    return NextResponse.json(
      { skills: [], latestBriefing: "", updatedAt: "" },
      { status: 500 }
    )
  }
}