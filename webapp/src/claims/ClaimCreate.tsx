// webapp/src/claims/ClaimCreate.tsx

import { type ClaimFormData } from '@newclaim/shared/src/schemas/claim'
import { useNavigate } from 'react-router-dom'
import { getClaimListRoute } from '../lib/routes'
import { useTitle } from '../lib/useTitle'
import { trpc } from '../trpc'
import { ClaimEditForm } from './ClaimEditForm'

export const ClaimCreate = () => {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const createClaim = trpc.claim.createClaim.useMutation()

  const handleSubmit = async (values: ClaimFormData) => {
    try {
      await createClaim.mutateAsync({
        description: values.description,
        text: values.text,
        numberField: values.numberField,
        datetimeField: values.datetimeField ? new Date(values.datetimeField).toISOString() : undefined,
      })
      void utils.claim.getAllClaims.invalidate()
      void navigate(getClaimListRoute())
    } catch (err) {
      alert('Ошибка при создании записи')
    }
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
    </>
  )
}
