// webapp/src/lib/useTitle.tsx

import { Helmet } from 'react-helmet-async'

export function useTitle(titlePart: string, base = 'NewClaim') {
  return (
    <Helmet>
      <title>{`${titlePart} — ${base}`}</title>
    </Helmet>
  )
}
