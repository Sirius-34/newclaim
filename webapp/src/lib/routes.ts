// webapp/src/lib/routes.ts

import { pgr } from './pumpGetRoute'

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getClaimListRoute = pgr(() => '/')

export const getClaimDetailsRoute = pgr({ id: true }, ({ id }) => `/claims/${id}`)

export const getClaimCreateRoute = pgr(() => '/create-claim')

export const getClaimEditRoute = pgr({ id: true }, ({ id }) => `/claims/${id}/edit`)

// export const getEditProfileRoute = pgr(() => '/edit-profile')

// export const getAllUsersRoute = pgr(() => '/admin/users')

// export const getEditUserRoute = pgr(() => '/admin/users/:userId')

// export const getDictionariesRoute = pgr(() => '/admin/dictionaries')

// export const getDictionaryRoute = pgr(() => '/admin/dictionaries/:table')
