// webapp/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EditProfilePage } from './auth/EditProfilePage'
import { SignInPage } from './auth/SignInPage'
import { SignOutPage } from './auth/SignOutPage'
import { SignUpPage } from './auth/SignUpPage'
import { ClaimCreate } from './claims/ClaimCreate'
import { ClaimDetails } from './claims/ClaimDetails'
import { ClaimEdit } from './claims/ClaimEdit'
import { ClaimList } from './claims/ClaimList'
import { Layout } from './components/Layout/Index'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { RequireAuth } from './components/RequireAuth'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './styles/global.scss'
import { UnauthorizedPage } from './pages/UnauthorizedPage'

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <NotAuthRouteTracker />
        <Routes>
          <Route element={<Layout />}>
            <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
            <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
            <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
            <Route path={routes.getClaimListRoute.definition} element={<ClaimList />} />
            <Route
              path={routes.getClaimDetailsRoute.definition}
              element={
                //                 <RequireAuth>
                <ClaimDetails />
                //                </RequireAuth>
              }
            />
            <Route
              path={routes.getClaimEditRoute.definition}
              element={
                <RequireAuth>
                  <ClaimEdit />
                </RequireAuth>
              }
            />
            <Route
              path={routes.getClaimCreateRoute.definition}
              element={
                <RequireAuth>
                  <ClaimCreate />
                </RequireAuth>
              }
            />
            <Route
              path={routes.getEditProfileRoute.definition}
              element={
                <RequireAuth>
                  <EditProfilePage />
                </RequireAuth>
              }
            />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  )
}
