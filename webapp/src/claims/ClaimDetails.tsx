// webapp/src/claims/ClaimDetails.tsx

import { useParams, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../assets/images/avatar-placeholder.jpg'
import { LinkButton } from '../components/Button'
import { UploadedFilesList } from '../components/FileUploader/UploadedFilesList'
import { ClaimPageWrapper } from '../components/PageWrappers/ClaimPageWrapper'
import { Segment } from '../components/Segment'
import { useMe } from '../lib/ctx'
import { getClaimListRoute, getClaimEditRoute } from '../lib/routes'
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

  const navigate = useNavigate()
  const location = useLocation()
  const me = useMe()

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
    void navigate('/not-found', { replace: true })
    return
  }

  const editLink = {
    pathname: getClaimEditRoute({ id }),
    state: { from: location.pathname },
  }

  // =========== for wrapper
  const accessAllowed = !!me && !!claim && (me.id === claim.authorId || me.userGroupName === 'Administrators')
  const titlePage = `Карточка #${claim.serialNumber}`
  // =========== for wrapper

  const desc = claim.description ?? '—'
  return (
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <>
        <Segment title={`Карточка № ${claim.serialNumber}`} description={`Short description: ${desc}`}>
          <div className={css.text}>Full text:</div>
          <br />
          <div className={css.text} dangerouslySetInnerHTML={{ __html: claim.text }} />
          <br />
          <div className={css.createdAt}>Created At: {new Date(claim.createdAt).toLocaleString()}</div>

          <div className={css.author}>
            <img className={css.avatar} alt="" src={avatar} />
            <div className={css.name}>
              Author:
              <br />
              {claim.author.nick}
              {claim.author.name ? ` (${claim.author.name})` : ''}
            </div>
          </div>

          <div className={css.documents}>
            Documents: <UploadedFilesList claimId={id} />
          </div>

          <div className={css.editButton}>
            <LinkButton to={editLink}>Edit Claim</LinkButton>
          </div>

          <div className={css.backButton}>
            <LinkButton to={getClaimListRoute()}>Back to ClaimList</LinkButton>
          </div>
        </Segment>
      </>
    </ClaimPageWrapper>
  )
}
