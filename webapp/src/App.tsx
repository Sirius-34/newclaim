// webapp/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClaimDetails } from './claims/ClaimDetails'
import { ClaimList } from './claims/ClaimList'
import { CreateClaim } from './claims/CreateClaim'
import { Layout } from './components/Layout/Index'
import { getClaimDetailsRoute, getClaimListRoute, getCreateClaimRoute } from './lib/routes'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={getClaimListRoute.definition} element={<ClaimList />} />
          <Route path={getClaimDetailsRoute.definition} element={<ClaimDetails />} />
          <Route path={getCreateClaimRoute.definition} element={<CreateClaim />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
