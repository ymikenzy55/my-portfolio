import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyToken } from '@/app/lib/auth'

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    const res = NextResponse.json({ sections })
    res.headers.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
    return res
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return prisma.admin.findUnique({ where: { id: payload.adminId } })
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const section = await prisma.section.update({
      where: { id: body.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        imageUrl: body.imageUrl,
        order: body.order,
        isActive: body.isActive,
      },
    })
    return NextResponse.json({ section })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
