// backend/src/lib/models.ts

import { pick } from '@newclaim/shared/src/pick'
import { type User } from '@prisma/client'

export const toClientMe = (
  user:
    | (User & {
        userGroup: { cUserGroupName: string }
      })
    | null
) => {
  if (!user) {
    return null
  }

  const base = pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar', 'userGroupID', 'cAct'])

  return {
    ...base,
    userGroup: user.userGroup,
  }
}
