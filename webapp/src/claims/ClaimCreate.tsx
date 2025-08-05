// webapp/src/claims/ClaimCreate.tsx

import { type ClaimFormData, type ClaimCreateData } from '@newclaim/shared/src/schemas/claim'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUploader } from '../components/FileUploader'
import { ClaimPageWrapper } from '../components/PageWrappers/ClaimPageWrapper'
import { useMe } from '../lib/ctx'
import { env } from '../lib/env'
import { getClaimListRoute } from '../lib/routes'
import { trpc } from '../trpc'
import { ClaimEditForm } from './ClaimEditForm'

export const ClaimCreate = () => {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const createClaim = trpc.claim.createClaim.useMutation()
  const me = useMe()

  // =========== for wrapper
  const accessAllowed = !!me
  const titlePage = 'Создание дела'
  // =========== for wrapper

  const [newClaimId, setNewClaimId] = useState<string | null>(null)

  const handleSubmit = async (values: ClaimFormData) => {
    try {
      const created = await createClaim.mutateAsync({
        description: values.description,
        text: values.text,
        numberField: values.numberField,
        datetimeField: values.datetimeField ? new Date(values.datetimeField).toISOString() : undefined,
        authorId: env.VITE_AUTHOR_ID_TEMP,
        yearAddedID: values.yearAddedID || null,
        appeal: values.appeal,
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
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <>
        <ClaimEditForm
          initialValues={{
            description: '',
            text: '',
            numberField: undefined,
            datetimeField: '',
            yearAddedID: '',
            appeal: false,
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
    </ClaimPageWrapper>
  )
}
