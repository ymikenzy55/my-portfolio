import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import nodemailer from 'nodemailer'

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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
