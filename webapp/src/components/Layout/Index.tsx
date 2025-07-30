// webapp/src/components/Layout/index.tsx

import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg?react'
import { getClaimListRoute, getCreateClaimRoute } from '../../lib/routes'
import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <Logo className={css.logo} />
        <ul className={css.menu}>
          <li className={css.item}>
            <Link className={css.link} to={getClaimListRoute()}>
              All Claims
            </Link>
          </li>
          <p>-------------------------</p>
          <li className={css.item}>
            <Link className={css.link} to={getCreateClaimRoute()}>
              Add Claim
            </Link>
          </li>
        </ul>
      </div>
      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
