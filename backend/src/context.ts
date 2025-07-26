// backend/src/context.ts

import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { createPrismaClient } from './lib/prisma'

const prisma = createPrismaClient()

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    prisma,
    user: null, // Позже добавим из JWT
  }
}

export type Context = ReturnType<typeof createContext>
