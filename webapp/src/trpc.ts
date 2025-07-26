// webapp/src/trpc.ts

import type { AppRouter } from '@newclaim/backend/src/router'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'
import { env } from './lib/env'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClientOptions = {
  transformer: superjson,
  links: [
    httpBatchLink({
      url: env.VITE_BACKEND_TRPC_URL,
      // url: 'http://localhost:3000/trpc',
      // credentials: 'include' // если планируется работа с cookie
    }),
  ],
}
