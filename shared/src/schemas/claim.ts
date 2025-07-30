// shared/src/schemas/claim.ts

import { z } from 'zod'

export const claimEditSchema = z.object({
  description: z.string().min(1).max(200),
  text: z.string().min(1),
  numberField: z.coerce.number().optional(),
  datetimeField: z.string().optional(),
})

export type ClaimFormData = z.infer<typeof claimEditSchema>
