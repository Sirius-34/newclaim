// backend/src/router/claim/index.ts

import { claimCreateSchema, claimEditSchema } from '@newclaim/shared/src/schemas/claim'
import { TRPCError } from '@trpc/server/dist/error/TRPCError'
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

  createClaim: publicProcedure.input(claimCreateSchema).mutation(async ({ input }) => {
    const { description, text, numberField, datetimeField, authorId } = input

    return await prisma.claim.create({
      data: {
        description,
        text,
        numberField,
        datetimeField,
        authorId,
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

  createDocument: publicProcedure
    .input(z.object({
      claimId: z.string().uuid(),
      name: z.string(),
      mimeType: z.string(),
      data: z.instanceof(Buffer), // или z.any(), если ты ещё не парсишь буфер
    }))
    .mutation(async ({ input }) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

      // Если data — это Buffer (а не string), можно проверить напрямую
      if (input.data.length > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Файл превышает допустимый размер (макс. 5 МБ)',
        })
      }

      return prisma.document.create({
        data: {
          claimId: input.claimId,
          name: input.name,
          mimeType: input.mimeType,
          data: input.data,
        },
      })
    }),

    // =================================================================================

})
