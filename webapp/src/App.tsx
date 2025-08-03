// webapp/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignInPage } from './auth/SignInPage'
import { SignOutPage } from './auth/SignOutPage'
import { SignUpPage } from './auth/SignUpPage'
import { ClaimCreate } from './claims/ClaimCreate'
import { ClaimDetails } from './claims/ClaimDetails'
import { ClaimEdit } from './claims/ClaimEdit'
import { ClaimList } from './claims/ClaimList'
import { Layout } from './components/Layout/Index'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import * as routes from './lib/routes'
import { NotFoundPage } from './pages/NotFoundPage'
import './styles/global.scss'

export default function App() {
  return (
    <BrowserRouter>
      <NotAuthRouteTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
          <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
          <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
          <Route path={routes.getClaimListRoute.definition} element={<ClaimList />} />
          <Route path={routes.getClaimDetailsRoute.definition} element={<ClaimDetails />} />
          <Route path={routes.getClaimEditRoute.definition} element={<ClaimEdit />} />
          <Route path={routes.getClaimCreateRoute.definition} element={<ClaimCreate />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
