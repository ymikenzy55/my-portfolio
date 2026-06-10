import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyToken } from '@/app/lib/auth'

async function getAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return prisma.admin.findUnique({ where: { id: payload.adminId } })
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const total = await prisma.pageView.count()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await prisma.pageView.count({
      where: { createdAt: { gte: today } },
    })

    const views = await prisma.pageView.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ total, today: todayCount, views })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || ''

    await prisma.pageView.create({
      data: {
        path: path || '/',
        ip: ip.split(',')[0].trim(),
        userAgent,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
