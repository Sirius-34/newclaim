// backend/src/router/claim/index.ts

/* eslint-disable no-console */

import { claimCreateSchema, claimEditSchema } from '@newclaim/shared/src/schemas/claim'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ExpectedError } from '../../lib/error'
import { toClientMe } from '../../lib/models'
import { createPrismaClient } from '../../lib/prisma'
import { publicProcedure, router } from '../../trpc'
import { getPasswordHash } from '../../utils/getPasswordHash'
import { signJWT } from '../../utils/signJWT'
import { zSignInInput } from '../auth/signIn/input'
import { zSignUpInput } from '../auth/signUp/input'

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
    const { description, text, numberField, datetimeField, authorId, yearAddedID, appeal } = input

    return await prisma.claim.create({
      data: {
        description,
        text,
        numberField,
        datetimeField,
        authorId,
        yearAddedID: yearAddedID || null,
        appeal,
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
    .input(
      z.object({
        claimId: z.string().uuid(),
        name: z.string(),
        mimeType: z.string(),
        data: z.instanceof(Uint8Array),
      })
    )
    .mutation(async ({ input }) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

      if (input.data.length > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Файл превышает допустимый размер (макс. 5 МБ)',
        })
      }

      return await prisma.document.create({
        data: {
          claimId: input.claimId,
          name: input.name,
          mimeType: input.mimeType,
          data: input.data,
        },
      })
    }),

  // =================================================================================

  getDocumentsByClaimId: publicProcedure.input(z.string().uuid()).query(async ({ input: claimId, ctx }) => {
    const documents = await ctx.prisma.document.findMany({
      where: { claimId },
      select: {
        id: true,
        name: true,
        mimeType: true,
        data: true, // обязательно для получения размера
      },
    })

    return documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      mimeType: doc.mimeType,
      size: doc.data.length, // размер в байтах
    }))
  }),

  // =================================================================================

  getAllYears: publicProcedure.query(async () => {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await prisma.sprYears.findMany({
      where: { cAct: true },
      orderBy: { npp: 'asc' },
    })
  }),

  // =================================================================================

  signIn: publicProcedure.input(zSignInInput).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        nick: input.nick,
        password: getPasswordHash(input.password),
      },
    })

    if (!user) {
      throw new ExpectedError('❌ Wrong nick or password')
    }

    if (!user.cAct) {
      throw new ExpectedError('📛 User account is blocked. Please, contact with the Administrator')
    }

    const token = signJWT(user.id)
    console.log('from TRPC SignIn - token: ', token)
    console.log('from TRPC SignIn - userId: ', user.id)
    return { token, userId: user.id }
  }),

  // =================================================================================

  signUp: publicProcedure.input(zSignUpInput).mutation(async ({ ctx, input }) => {
    const exUserWithNick = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exUserWithNick) {
      throw new ExpectedError('⚠️ User with this nick already exists')
    }
    const exUserWithEmail = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    })
    if (exUserWithEmail) {
      throw new ExpectedError('⚠️ User with this email already exists')
    }
    const user = await ctx.prisma.user.create({
      data: {
        nick: input.nick,
        email: input.email,
        password: getPasswordHash(input.password),
      },
    })
    const token = signJWT(user.id)
    return { token, userId: user.id }
  }),

  // =================================================================================

  getMe: publicProcedure.query(async ({ ctx }) => {
    //     console.info('ctx.user in getMe:', ctx.user)

    if (!ctx.user) {
      return { me: null }
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        userGroup: {
          select: {
            cUserGroupName: true,
          },
        },
      },
    })

    const me = toClientMe(user)
    //    console.info('Converted me:', me)

    return { me }
  }),

  // =================================================================================
})
