// backend/src/scripts/presetDB.ts

import { env } from '../lib/env'
import { type AppContext } from '../lib/ctx'
import { ExpectedError } from '../lib/error'
// import { createPrismaClient } from '../lib/prisma'
import { getPasswordHash } from '../utils/getPasswordHash'

export const presetDb = async (ctx: AppContext) => {
  const adminGroup = await ctx.prisma.sprUserGroup.findFirst({ where: { cUserGroupName: 'Administrators' } })
  if (adminGroup === null) {
    throw new ExpectedError('⚠️ Error in guide Users: null userGroupID')
  }

  await ctx.prisma.user.upsert({
    where: {
      nick: 'admin',
    },
    create: {
      nick: 'admin',
      email: 'admin@example.com',
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
      userGroupID: adminGroup.id,
    },
    update: {
      permissions: ['ALL'],
    },
  })
}
