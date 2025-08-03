import { zStringRequired } from '@newclaim/shared/src/zod'
import { z } from 'zod'

export const zSignInInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
})
