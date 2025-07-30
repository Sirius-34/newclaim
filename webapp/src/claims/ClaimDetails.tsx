// webapp/src/claims/ClaimDetails.tsx

/* eslint-disable react-hooks/rules-of-hooks */

import { useParams, useLocation } from 'react-router-dom'
import { LinkButton } from '../components/Button'
import { getClaimListRoute, getClaimEditRoute } from '../lib/routes'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'
import css from './index.module.scss'

export const ClaimDetails = () => {
  const params = useParams<{ id?: string }>()
  const id = params.id

  const {
    data: claim,
    isLoading,
    error,
  } = trpc.claim.getClaimById.useQuery(id ?? '', {
    enabled: !!id,
  })

  if (!id) {
    return <div>Некорректный ID</div>
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>
  }

  if (!claim) {
    return <div>Запись не найдена</div>
  }

  const location = useLocation()
  const editLink = {
    pathname: getClaimEditRoute({ id }),
    state: { from: location.pathname },
  }

  return (
    <>
      {useTitle(`Карточка #${claim.serialNumber}`)}
      <div style={{ padding: '1rem' }}>
        <h2>Детали дела #{claim.id}</h2>
        <p>
          <strong>Автор:</strong> {claim.author?.name ?? '—'}
        </p>
        <p>
          <strong>Создано:</strong> {new Date(claim.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Описание:</strong> {claim.description ?? '—'}
        </p>
      </div>
      <div className={css.editButton}>
        <LinkButton to={editLink}>Edit Claim</LinkButton>
      </div>
      <div className={css.backButton}>
        <LinkButton to={getClaimListRoute()}>Back to ClaimList</LinkButton>
      </div>
    </>
  )
}
