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

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ links })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const link = await prisma.socialLink.create({
      data: {
        name: body.name,
        url: body.url,
        icon: body.icon || 'Link',
        order: body.order ?? 0,
      },
    })
    return NextResponse.json({ link }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
