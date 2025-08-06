// backend/src/router/auth/updateProfile/index.ts

import { ExpectedError } from '../../../lib/error'
import { toClientMe } from '../../../lib/models'
import { publicProcedure } from '../../../trpc'
import { zUpdateProfileInput } from './input'

export const updateProfileRoute = publicProcedure.input(zUpdateProfileInput).mutation(async ({ ctx, input }) => {
  if (!ctx.user) {
    throw new Error('📛 UNAUTHORIZED')
  }
  if (ctx.user.nick !== input.nick) {
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exUser) {
      throw new ExpectedError('⚠️ User with this nick already exists')
    }
  }

  const updatedMe = await ctx.prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: input,
    include: {
      userGroup: {
        select: {
          cUserGroupName: true,
        },
      },
    },
  })

  ctx.user = updatedMe

  return toClientMe(updatedMe)
})
