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

    const { searchParams } = new URL(req.url)
    const unread = searchParams.get('unread')

    const messages = await prisma.contactMessage.findMany({
      where: unread === 'true' ? { read: false } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ messages })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids, read } = await req.json()
    await prisma.contactMessage.updateMany({
      where: { id: { in: ids } },
      data: { read },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
