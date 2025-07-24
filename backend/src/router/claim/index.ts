// backend/src/router/claim/index.ts

import { z } from 'zod'
import { createPrismaClient } from '../../lib/prisma'
import { publicProcedure, router } from '../../trpc'

const prisma = createPrismaClient()

export const claimRouter = router({
  getAllClaims: publicProcedure.query(async () => {
    return await prisma.claim.findMany({
      include: {
        author: {
          select: { id: true, name: true, nick: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getClaimById: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    return await prisma.claim.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })
  }),
})
