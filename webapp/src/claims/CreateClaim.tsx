// webapp/src/claims/CreateClaim.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClaimListRoute } from '../lib/routes'
import { trpc } from '../trpc'

export function CreateClaim() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const createClaim = trpc.claim.createClaim.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createClaim.mutateAsync({ description, text })
      void navigate(getClaimListRoute()) // после создания — назад к списку
    } catch (err) {
      alert('Ошибка при создании записи')
    }
  }

  return (
    <form onSubmit={ handleSubmit }>
      <h2>Новое дело</h2>
      <textarea value={description} onChange={e => { setDescription(e.target.value); }} placeholder="Краткое описание" required />
      <textarea value={text} onChange={e => { setText(e.target.value); }} placeholder="Подробная информация по иску" required />
      <button type="submit">Создать</button>
    </form>
  )
}
