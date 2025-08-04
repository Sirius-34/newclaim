// backend/src/lib/verifyJWT.ts

import { env } from '../lib/env'
import jwt from 'jsonwebtoken'

const JWT_SECRET = env.JWT_SECRET

export function verifyJWT(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return { userId: decoded.userId as string }
    }
    return null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Invalid token:', err)
    return null
  }
}
