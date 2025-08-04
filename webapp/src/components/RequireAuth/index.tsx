// webapp/src/components/RequireAuth/index.tsx

import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../../lib/ctx'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const me = useMe()
  const location = useLocation()

  if (!me) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}
