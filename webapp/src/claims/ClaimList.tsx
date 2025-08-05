// webapp/src/claims/ClaimList.tsx

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClaimPageWrapper } from '../components/PageWrappers/ClaimPageWrapper'
import { useMe } from '../lib/ctx'
import { trpc } from '../trpc'
import css from './ClaimList.module.scss'

export const ClaimList = () => {
  const { data: claims, isLoading, error } = trpc.claim.getAllClaims.useQuery()
  const navigate = useNavigate()
  const me = useMe()

  // eslint-disable-next-line no-console
  console.log('me:', me)

  const handleDoubleClick = useCallback(
    (id: string) => {
      void navigate(`/claims/${id}`)
    },
    [navigate]
  )

  if (isLoading) {
    return <div className={css.loading}>Загрузка...</div>
  }
  if (error) {
    return <div className={css.error}>Ошибка загрузки: {error.message}</div>
  }

  // =========== for wrapper
  const accessAllowed = !!me
  const titlePage = 'Список дел'
  // =========== for wrapper

  return (
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <div className={css.wrapper}>
        <table className={css.table}>
          <thead>
            <tr className={css.headerCell}>
              <th className={css.cell}>Автор</th>
              <th className={css.cell} style={{ width: '15%' }}>
                Создано
              </th>
              <th className={css.cell}>Описание</th>
            </tr>
          </thead>
          <tbody>
            {claims?.map((claim, rowIndex) => (
              <tr
                key={claim.id}
                onDoubleClick={() => {
                  handleDoubleClick(claim.id)
                }}
                className={rowIndex % 2 === 0 ? css.rowEven : css.rowOdd}
              >
                <td className={css.cell}>{claim.author?.name ?? '—'}</td>
                <td className={css.cell}>{new Date(claim.createdAt).toLocaleString()}</td>
                <td className={css.cell}>{claim.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClaimPageWrapper>
  )
}
