// webapp/src/lib/ctx.tsx

import type { AppRouter } from '@newclaim/backend/src/router'
import type { inferProcedureOutput } from '@trpc/server'
import { createContext, useContext } from 'react'
import { Loader } from '../components/Loader'
import { trpc } from '../trpc'

export type AppContext = {
  me: inferProcedureOutput<AppRouter['claim']['getMe']>['me'] | null
}

const AppReactContext = createContext<AppContext>({
  me: null,
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, isError } = trpc.claim.getMe.useQuery()
  return (
    <AppReactContext.Provider
      value={{
        me: data?.me || null,
      }}
    >
      {isLoading || isFetching ? <Loader type="page" /> : isError ? <p>Error: {error.message}</p> : children}
    </AppReactContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}
