import { zNickRequired } from '@claimbase/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  nick: zNickRequired,
  name: z.string().max(50).default(''),
  avatar: z.string().nullable(),
  userGroupID: z.string().optional(),
  cAct: z.boolean().default(true),
})
