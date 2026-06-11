import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'resume_file_url' },
    })

    const url = setting?.value
    if (!url) {
      return NextResponse.json({ error: 'No resume uploaded' }, { status: 404 })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 502 })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const buffer = await response.arrayBuffer()

    const filename = url.split('/').pop() || 'resume.pdf'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
