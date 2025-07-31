// webapp/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClaimCreate } from './claims/ClaimCreate'
import { ClaimDetails } from './claims/ClaimDetails'
import { ClaimEdit } from './claims/ClaimEdit'
import { ClaimList } from './claims/ClaimList'
import { Layout } from './components/Layout/Index'
import { getClaimCreateRoute, getClaimDetailsRoute, getClaimEditRoute, getClaimListRoute } from './lib/routes'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={getClaimListRoute.definition} element={<ClaimList />} />
          <Route path={getClaimDetailsRoute.definition} element={<ClaimDetails />} />
          <Route path={getClaimEditRoute.definition} element={<ClaimEdit />} />
          <Route path={getClaimCreateRoute.definition} element={<ClaimCreate />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
