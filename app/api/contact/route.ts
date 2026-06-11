import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    try {
      await prisma.contactMessage.create({
        data: { name, email, phone: phone || null, message },
      })
    } catch (dbErr: any) {
      if (dbErr?.code === 'P2022') {
        await prisma.contactMessage.create({
          data: { name, email, message },
        })
      } else {
        throw dbErr
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact API error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Failed to send message' }, { status: 500 })
  }
}
