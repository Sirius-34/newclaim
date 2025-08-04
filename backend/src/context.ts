// backend/src/context.ts

import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { parse } from 'cookie'
import { verifyJWT } from '../src/utils/verifyJWT'
import { createPrismaClient } from './lib/prisma'

const prisma = createPrismaClient()

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.token

  // eslint-disable-next-line no-console
  //  console.log('Parsed cookies:', cookies)
  //  console.log('Extracted token:', token)

  let user = null
  const payload = token ? verifyJWT(token) : null

  if (payload?.userId) {
    try {
      //      console.log('Decoded userId from JWT:', payload.userId)
      user = await prisma.user.findUnique({ where: { id: payload.userId } })
      //      console.log('Found user from DB:', user)
    } catch (err) {
      // eslint-disable-next-line no-console
      //      console.warn('⚠️ Failed to fetch user from token:', err)
      user = null
    }
  }

  return {
    req,
    res,
    prisma,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
