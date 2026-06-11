import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: Request) {
  try {
    const [urlSetting, nameSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'resume_file_url' } }),
      prisma.siteSetting.findUnique({ where: { key: 'resume_file_name' } }),
    ])

    const url = urlSetting?.value
    if (!url) {
      return NextResponse.json({ error: 'No resume uploaded' }, { status: 404 })
    }

    const originalName = nameSetting?.value
    const fallbackName = url.split('/').pop() || 'resume.pdf'
    const filename = originalName || fallbackName

    // Detect content type from filename extension
    const ext = filename.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

    // Try to proxy from Cloudinary; if streaming fails, redirect directly
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        return NextResponse.redirect(url)
      }

      // Stream the response body directly to avoid binary buffer corruption
      return new NextResponse(response.body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } catch {
      // Fallback: redirect directly to Cloudinary URL
      return NextResponse.redirect(url)
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
