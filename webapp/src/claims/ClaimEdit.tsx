// webapp/src/claims/ClaimEdit.tsx

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LinkButton } from '../components/Button'
import { getClaimDetailsRoute, getClaimListRoute } from '../lib/routes'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'
import css from './index.module.scss'

  export const ClaimEdit = () => {
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()
  const id = params.id ?? ''

  const {
    data: claim,
    isLoading,
    error,
  } = trpc.claim.getClaimById.useQuery(id, {
    enabled: !!id,
  })

  const updateClaim = trpc.claim.updateClaim.useMutation()

  const [description, setDescription] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (claim) {
      setDescription(claim.description ?? '')
      setText(claim.text ?? '')
    }
  }, [claim])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateClaim.mutateAsync({ id, description, text })
      void navigate(getClaimListRoute())
    } catch (err) {
      alert('Ошибка при редактировании записи')
    }
  }

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

  const from = (useLocation().state as { from?: string })?.from
  const fallback = getClaimDetailsRoute({ id })

  return (
    <>
      {useTitle(`Редактирование дела #${claim.serialNumber}`)}
      <form onSubmit={handleSubmit}>
        <h2>Редактирование дела</h2>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          placeholder="Краткое описание"
          required
        />
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
          placeholder="Полное описание"
          required
        />
        <button type="submit">Сохранить</button>
      </form>
      <div className={css.backButton}>
        <LinkButton color="red" to={from ?? fallback}>Back to Claim</LinkButton>
      </div>
      <div className={css.backButton}>
        <LinkButton to={getClaimListRoute()}>Go to ClaimList</LinkButton>
      </div>
    </>
  )
}
