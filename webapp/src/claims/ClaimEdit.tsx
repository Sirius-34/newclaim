// webapp/src/claims/ClaimEdit.tsx

import { type ClaimFormData } from '@newclaim/shared/src/schemas/claim'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LinkButton } from '../components/Button'
import { ClaimPageWrapper } from '../components/PageWrappers/ClaimPageWrapper'
import { useMe } from '../lib/ctx'
import { getClaimDetailsRoute, getClaimListRoute } from '../lib/routes'
import { trpc } from '../trpc'
import { ClaimEditForm } from './ClaimEditForm'
import css from './index.module.scss'

export const ClaimEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? getClaimListRoute()
  const me = useMe()

  const utils = trpc.useUtils()
  const updateClaim = trpc.claim.updateClaim.useMutation()

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

  // =========== for wrapper
  const accessAllowed = !!me && !!claim && (me.id === claim.authorId || me.userGroupName === 'Administrators')
  const titlePage = `Редактирование #${claim.serialNumber}`
  // =========== for wrapper

  const fallback = getClaimDetailsRoute({ id })

  const handleSubmit = async (values: ClaimFormData) => {
    try {
      await updateClaim.mutateAsync({
        id,
        description: values.description,
        text: values.text,
        numberField: values.numberField,
        datetimeField: values.datetimeField ? new Date(values.datetimeField).toISOString() : undefined,
        yearAddedID: values.yearAddedID || null,
        appeal: values.appeal,
      })

      void utils.claim.getClaimById.invalidate(id)
      void navigate(from)
    } catch (err) {
      alert('Ошибка при обновлении записи')
    }
  }

  return (
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <div style={{ padding: '1rem' }}>
        <h2>Редактирование дела</h2>
        <ClaimEditForm
          claimId={claim.id}
          initialValues={{
            description: claim.description,
            text: claim.text,
            numberField: claim.numberField ?? undefined,
            datetimeField: claim.datetimeField ? new Date(claim.datetimeField).toISOString().slice(0, 16) : '',
            yearAddedID: claim.yearAddedID ?? '',
            appeal: claim.appeal ?? false,
          }}
          onSubmit={handleSubmit}
        />
        <div className={css.backButton}>
          <LinkButton color="red" to={fallback}>
            Back to Claim
          </LinkButton>
        </div>
        <div className={css.backButton}>
          <LinkButton to={getClaimListRoute()}>Go to ClaimList</LinkButton>
        </div>
      </div>
    </ClaimPageWrapper>
  )
}
