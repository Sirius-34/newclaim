// shared/src/schemas/claim.ts

import { z } from 'zod'

export const claimBaseSchema = z.object({
  description: z.string().min(1).max(200),
  text: z.string().min(1),
  numberField: z.coerce.number().optional(),
  datetimeField: z.string().optional(),
  yearAddedID: z.string().uuid().optional().nullable(),
  appeal: z.boolean().optional(),
})

export const claimEditSchema = claimBaseSchema

export const claimCreateSchema = claimBaseSchema.extend({
  authorId: z.string().uuid(),
})

export type ClaimFormData = z.infer<typeof claimEditSchema>
export type ClaimCreateData = z.infer<typeof claimCreateSchema>
