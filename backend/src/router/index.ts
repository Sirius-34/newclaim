// backend/src/router/index.ts

import { router } from '../trpc'
import { updatePasswordRoute } from './auth/updatePassword'
import { updateProfileRoute } from './auth/updateProfile'
import { claimRouter } from './claim'

export const appRouter = router({
  claim: claimRouter,
  authUpdateProfile: updateProfileRoute,
  authUpdatePassword: updatePasswordRoute,
})

export type AppRouter = typeof appRouter
