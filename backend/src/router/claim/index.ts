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

  createClaim: publicProcedure
    .input(z.object({
      description: z.string().min(1).max(200),
      text: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const { description, text } = input

      return await prisma.claim.create({
        data: {
          description,
          text,
          authorId: 'fc3f3795-c82c-49aa-a257-ffd902d1e7a0', // временное решение
        },
      })
    }),

})
