import { zNickRequired } from '@newclaim/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileInput = z.object({
  nick: zNickRequired,
  name: z.string().max(50).default(''),
  avatar: z.string().nullable(),
  userGroupID: z.string().optional(),
  cAct: z.boolean().default(true),
})
