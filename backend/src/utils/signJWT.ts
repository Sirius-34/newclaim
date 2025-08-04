// backend/src/utils/signJWT.ts

import { env } from '../lib/env'
import jwt from 'jsonwebtoken'

// export const signJWT = (userId: string): string => {
//  return jwt.sign(userId, env.JWT_SECRET)
// }

export function signJWT(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '30d' })
}
