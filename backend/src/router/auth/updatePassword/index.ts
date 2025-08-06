// backend/src/router/auth/updatePassword/index.ts

import { ExpectedError } from '../../../lib/error'
import { publicProcedure } from '../../../trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { zUpdatePasswordInput } from './input'

export const updatePasswordRoute = publicProcedure.input(zUpdatePasswordInput).mutation(async ({ ctx, input }) => {
  if (!ctx.user) {
    throw new Error('📛 UNAUTHORIZED')
  }
  if (ctx.user.password !== getPasswordHash(input.oldPassword)) {
    throw new ExpectedError('❌ Wrong old password')
  }
  const updatedMe = await ctx.prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      password: getPasswordHash(input.newPassword),
    },
  })
  ctx.user = updatedMe
  return true
})
