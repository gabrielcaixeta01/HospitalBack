import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const res = await prisma.especialidade.create({
      data: { nome: 'Ortopedia' }
    })
    console.log('created:', res)
  } catch (e) {
    console.error('error creating especialidade:')
    console.error(e)
    // If PrismaError with meta, print meta
    if (e && typeof e === 'object' && 'meta' in e) console.error('meta:', e.meta)
  } finally {
    await prisma.$disconnect()
  }
}

main()
