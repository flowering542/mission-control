import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Check proxy status
    const proxyStatus = await checkProxy()
    
    // Get system metrics
    const { stdout: diskOut } = await execAsync("df -h / | tail -1 | awk '{print $5}'")
    const { stdout: memOut } = await execAsync(`free -h | grep Mem | awk '{print $3"/"$2}'`)
    const { stdout: cpuOut } = await execAsync("uptime | awk -F'load average:' '{print $2}'")
    const { stdout: uptimeOut } = await execAsync("uptime -p")

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      proxy: proxyStatus,
      system: {
        disk: diskOut.trim(),
        memory: memOut.trim(),
        cpu: cpuOut.trim(),
        uptime: uptimeOut.trim(),
      },
    })
  } catch (error) {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      proxy: { status: 'unknown', responseCode: 0 },
      system: {
        disk: 'N/A',
        memory: 'N/A',
        cpu: 'N/A',
        uptime: 'N/A',
      },
    })
  }
}

async function checkProxy(): Promise<{ status: string; responseCode: number }> {
  try {
    const { stdout } = await execAsync(
      'curl -s --max-time 5 -x http://127.0.0.1:7890 https://www.google.com/ -o /dev/null -w "%{http_code}"'
    )
    const code = parseInt(stdout.trim())
    return {
      status: code === 200 ? 'ok' : 'error',
      responseCode: code,
    }
  } catch {
    return { status: 'error', responseCode: 0 }
  }
}
