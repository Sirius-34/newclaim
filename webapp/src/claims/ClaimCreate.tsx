// webapp/src/claims/ClaimCreate.tsx

import { type ClaimFormData, type ClaimCreateData } from '@newclaim/shared/src/schemas/claim'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUploader } from '../components/FileUploader'
import { env } from '../lib/env'
import { getClaimListRoute } from '../lib/routes'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'
import { ClaimEditForm } from './ClaimEditForm'

export const ClaimCreate = () => {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const createClaim = trpc.claim.createClaim.useMutation()

  const [newClaimId, setNewClaimId] = useState<string | null>(null)

  const handleSubmit = async (values: ClaimFormData) => {
    try {
      const created = await createClaim.mutateAsync({
        description: values.description,
        text: values.text,
        numberField: values.numberField,
        datetimeField: values.datetimeField
          ? new Date(values.datetimeField).toISOString()
          : undefined,
        authorId: env.VITE_AUTHOR_ID_TEMP,
      } satisfies ClaimCreateData)

      setNewClaimId(created.id) // сохраняем ID созданной записи
    } catch (err) {
      alert('Ошибка при создании записи')
    }
  }

  const handleComplete = () => {
    void utils.claim.getAllClaims.invalidate()
    void navigate(getClaimListRoute())
  }

  return (
    <>
      {useTitle('Создание дела')}
      <ClaimEditForm
        initialValues={{
          description: '',
          text: '',
          numberField: undefined,
          datetimeField: '',
        }}
        onSubmit={handleSubmit}
      />

      {newClaimId && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Загрузить документы</h3>
          <FileUploader parentId={newClaimId} onComplete={handleComplete} />
        </div>
      )}
    </>
  )
}
