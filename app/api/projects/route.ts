import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyToken } from '@/app/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ projects })
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

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        category: body.category,
        imageUrl: body.imageUrl,
        link: body.link || null,
        githubLink: body.githubLink || null,
        liveLink: body.liveLink || null,
        tags: body.tags || [],
        order: body.order ?? 0,
      },
    })
    return NextResponse.json({ project }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
