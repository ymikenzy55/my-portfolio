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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ project })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        category: body.category,
        imageUrl: body.imageUrl,
        link: body.link,
        githubLink: body.githubLink,
        liveLink: body.liveLink,
        tags: body.tags,
        order: body.order,
        isActive: body.isActive,
      },
    })
    return NextResponse.json({ project })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
