// webapp/src/components/Layout/index.tsx

import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg?react'
import { useMe } from '../../lib/ctx'
import * as r from '../../lib/routes'
import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()
  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <Logo className={css.logo} />
        <ul className={css.menu}>
          <li className={css.item}>
            <Link className={css.link} to={r.getClaimListRoute()}>
              All Claims
            </Link>
          </li>
          {me ? (
            <>
              <p>-------------------------</p>
              <li className={css.item}>
                <Link className={css.link} to={r.getClaimCreateRoute()}>
                  Add Claim
                </Link>
              </li>
              <li className={css.item}>
                <Link className={css.link} to={r.getSignOutRoute()}>
                  Log Out ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={css.item}>
                <Link className={css.link} to={r.getSignUpRoute()}>
                  Sign Up
                </Link>
              </li>
              <li className={css.item}>
                <Link className={css.link} to={r.getSignInRoute()}>
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
