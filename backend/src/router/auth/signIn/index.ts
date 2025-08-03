import { ExpectedError } from '../../../lib/error'
import { publicProcedure } from '../../../trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignInInput } from './input'

export const signIn = publicProcedure.input(zSignInInput).mutation(async ({ ctx, input }) => {
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
  return { token, userId: user.id }
})
