// webapp/src/auth/SignOutPage/index.tsx

import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../components/Loader'
import { getSignInRoute } from '../../lib/routes'
import { trpc } from '../../trpc'

export const SignOutPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  useEffect(() => {
    Cookies.remove('token')
    void trpcUtils.invalidate().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigate(getSignInRoute())
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Loader type="page" />
}
