import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const [urlSetting, nameSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'resume_file_url' } }),
      prisma.siteSetting.findUnique({ where: { key: 'resume_file_name' } }),
    ])

    const url = urlSetting?.value
    if (!url) {
      return NextResponse.json({ error: 'No resume uploaded' }, { status: 404 })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 502 })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const originalName = nameSetting?.value
    const fallbackName = url.split('/').pop() || 'resume.pdf'
    const filename = originalName || fallbackName

    // Stream the response body directly to avoid binary buffer corruption
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
