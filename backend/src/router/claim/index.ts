// backend/src/router/claim/index.ts

import { claimEditSchema } from '@newclaim/shared/src/schemas/claim'
import { z } from 'zod'
import { createPrismaClient } from '../../lib/prisma'
import { publicProcedure, router } from '../../trpc'

const prisma = createPrismaClient()

export const claimRouter = router({
  // =================================================================================

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

  // =================================================================================

  getClaimById: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    return await prisma.claim.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })
  }),

  // =================================================================================

  createClaim: publicProcedure.input(claimEditSchema).mutation(async ({ input }) => {
    const { description, text, numberField, datetimeField } = input

    return await prisma.claim.create({
      data: {
        description,
        text,
        numberField,
        datetimeField,
        authorId: 'fc3f3795-c82c-49aa-a257-ffd902d1e7a0', // временное решение
      },
    })
  }),

  // =================================================================================

  updateClaim: publicProcedure.input(claimEditSchema.extend({ id: z.string() })).mutation(async ({ input }) => {
    const { id, ...rest } = input

    return await prisma.claim.update({
      where: { id },
      data: rest,
    })
  }),

  // =================================================================================
})
