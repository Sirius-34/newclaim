import { pgr } from './pumpGetRoute'

export const getClaimListRoute = pgr(() => '/')

export const getClaimDetailsRoute = pgr({ id: true }, ({ id }) => `/claims/${id}`)

export const getClaimCreateRoute = pgr(() => '/create-claim')

export const getClaimEditRoute = pgr({ id: true }, ({ id }) => `/claims/${id}/edit`)

// export const getCreateClaimRoute = pgr(() => '/create-claim')

// export const getSignUpRoute = pgr(() => '/sign-up')

// export const getSignInRoute = pgr(() => '/sign-in')

// export const getSignOutRoute = pgr(() => '/sign-out')

// export const getEditProfileRoute = pgr(() => '/edit-profile')

// export const getEditClaimRoute = pgr({ claimBase: true }, ({ claimBase }) => `/claims/${claimBase}/edit`)

// export const getAllUsersRoute = pgr(() => '/users')

// export const getEditUserRoute = pgr(() => '/admin/users/:userId')

// export const getDictionariesRoute = pgr(() => '/admin/dictionaries')

// export const getDictionaryRoute = pgr(() => '/admin/dictionaries/:table')
