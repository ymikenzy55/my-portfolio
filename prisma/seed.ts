import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.ADMIN_EMAIL || 'yeboahmichael977@gmail.com'
  const password = process.env.ADMIN_PASSWORD || '!@Firatata45'
  const hashed = await bcrypt.hash(password, 12)

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin',
      password: hashed,
    },
  })

  const defaultSections = [
    { key: 'hero', title: 'Yeboah Michael', subtitle: 'Software Developer', content: '', order: 0 },
    { key: 'about', title: 'About Me', subtitle: '', content: '', order: 1 },
    { key: 'skills', title: 'Services', subtitle: '', content: '', order: 2 },
    { key: 'projects', title: 'Projects', subtitle: '', content: '', order: 3 },
    { key: 'resume', title: 'Resume', subtitle: '', content: '', order: 4 },
    { key: 'contact', title: 'Contact', subtitle: '', content: '', order: 5 },
  ]

  for (const s of defaultSections) {
    await prisma.section.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }

  const defaultProjects = [
    {
      title: 'E-Commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-stack e-commerce solution with payment integration and inventory management.',
      category: 'Web Development',
      imageUrl: '/project-1.jpg',
      link: '#',
      tags: ['Next.js', 'Stripe', 'PostgreSQL'],
      order: 0,
    },
    {
      title: 'Brand Identity System',
      slug: 'brand-identity-system',
      description: 'Complete brand identity including logo, typography, and design system.',
      category: 'Design',
      imageUrl: '/project-2.jpg',
      link: '#',
      tags: ['Figma', 'Illustrator', 'Branding'],
      order: 1,
    },
    {
      title: 'Mobile App UI Kit',
      slug: 'mobile-app-ui-kit',
      description: 'A comprehensive UI kit for fintech mobile applications.',
      category: 'UI/UX',
      imageUrl: '/project-3.jpg',
      link: '#',
      tags: ['Figma', 'Prototyping', 'Design System'],
      order: 2,
    },
  ]

  for (const p of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  console.log('Seed completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
