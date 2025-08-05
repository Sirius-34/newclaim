// webapp/src/components/PageWrappers/ClaimPageWrapper.tsx

import { type ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe } from '../../lib/ctx'
import { useTitle } from '../../lib/useTitle'

type Props = {
  title: string
  accessAllowed: boolean
  redirectPath?: string
  children: ReactNode
}

export const ClaimPageWrapper = ({ title, accessAllowed, redirectPath = '/access-denied', children }: Props) => {
  const me = useMe()
  const navigate = useNavigate()

  useTitle(title)

  useEffect(() => {
    if (me === undefined) {
      return
    }
    if (!accessAllowed) {
      void navigate(me ? redirectPath : '/unauthorized', { replace: true })
    }
  }, [me, accessAllowed, navigate, redirectPath])

  if (me === undefined) {
    // В перспективе можно вставить лоадер-заглушку...
    return null
  }

  return <>{accessAllowed ? children : null}</>
}
