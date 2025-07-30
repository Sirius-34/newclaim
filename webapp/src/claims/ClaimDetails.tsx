// webapp/src/claims/ClaimDetails.tsx

/* eslint-disable react-hooks/rules-of-hooks */

import { useNavigate, useParams } from 'react-router-dom'
import { getClaimListRoute } from '../lib/routes'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'

export const ClaimDetails = () => {
  const navigate = useNavigate()
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

  return (
    <>
      { useTitle(`Карточка #${claim.serialNumber}`) }
      <div style={{ padding: '1rem' }}>
        <button
          onClick={() => {
            void navigate(getClaimListRoute())
          }}
        >
          ← К списку дел
        </button>
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
    </>
  )
}
