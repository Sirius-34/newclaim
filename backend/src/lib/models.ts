// backend/src/lib/models.ts

import { pick } from '@newclaim/shared/src/pick'
import { type User } from '@prisma/client'

export const toClientMe = (user: (User & { userGroup?: { cUserGroupName: string } }) | null) => {
  if (!user) {
    return null
  }

  return {
    ...pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar', 'userGroupID', 'cAct']),
    userGroupName: user.userGroup?.cUserGroupName ?? null,
  }
}

// export const toClientMe = (user: User | null) => {
//   return user && pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar', 'userGroupID', 'cAct'])
// }
