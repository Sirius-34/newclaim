// webapp/src/claims/ClaimList.tsx

/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'

export const ClaimList = () => {
  const { data: claims, isLoading, error } = trpc.claim.getAllClaims.useQuery()
  const navigate = useNavigate()

  const handleDoubleClick = useCallback(
    (id: string) => {
      void navigate(`/claims/${id}`)
    },
    [navigate]
  )

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (error) {
    return <div>Ошибка загрузки: {error.message}</div>
  }

  return (
    <>
      {useTitle('Список дел')}
      <table>
        <thead>
          <tr>
            <th>Автор</th>
            <th>Создано</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {claims?.map((claim) => (
            <tr
              key={claim.id}
              onDoubleClick={() => {
                handleDoubleClick(claim.id)
              }}
            >
              <td>{claim.author?.name ?? '—'}</td>
              <td>{new Date(claim.createdAt).toLocaleString()}</td>
              <td>{claim.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
