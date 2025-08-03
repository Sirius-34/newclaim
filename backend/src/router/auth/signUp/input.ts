import { zNickRequired, zEmailRequired, zStringRequired } from '@newclaim/shared/src/zod'
import { z } from 'zod'

export const zSignUpInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
