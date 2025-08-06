import { zStringRequired } from '@newclaim/shared/src/zod'
import { z } from 'zod'

export const zUpdatePasswordInput = z.object({
  oldPassword: zStringRequired,
  newPassword: zStringRequired,
})
