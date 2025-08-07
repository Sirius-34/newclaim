import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '../components/DataTable'
import { ClaimPageWrapper } from '../components/PageWrappers/ClaimPageWrapper'
import { useMe } from '../lib/ctx'
import { trpc } from '../trpc'

// Временно: тип явно, пока нет общего Claim в shared
type Claim = {
  id: string
  createdAt: Date
  serialNumber: number
  numCourtCase: string | null
  regNumIntDoc: string | null
  description: string
  text: string
  numberField: number | null
  datetimeField: Date | null
  yearAddedID: string | null
  appeal: boolean | null
  authorId: string
  updatedAt: Date
  blockedAt: Date | null
  author: {
    id: string
    name: string
    nick: string
  }
}

export const ClaimList = () => {
  const { data: claims, isLoading, error } = trpc.claim.getAllClaims.useQuery()
  const navigate = useNavigate()
  const me = useMe()

  const accessAllowed = !!me
  const titlePage = 'Список дел'

  const handleDoubleClick = useCallback(
    (id: string) => {
      void navigate(`/claims/${id}`)
    },
    [navigate]
  )

  const columns: Array<Column<Claim>> = useMemo(
    () => [
      { header: 'Автор', accessor: 'author', sortable: true },
      { header: 'Создано', accessor: 'createdAt', sortable: true },
      { header: 'Номер дела в суде', accessor: 'numCourtCase', sortable: true },
      { header: 'Внутренний номер', accessor: 'regNumIntDoc', sortable: true },
      { header: 'Описание', accessor: 'description', sortable: true },
    ],
    []
  )

  const transformValue = (key: keyof Claim, value: unknown): React.ReactNode => {
    if (key === 'createdAt' && typeof value === 'string') {
      return new Date(value).toLocaleString()
    }

    if (key === 'createdAt' && value instanceof Date) {
      return value.toLocaleString()
    }

    if (key === 'author' && typeof value === 'object' && value !== null) {
      const author = value as Claim['author']
      return author.name ?? '—'
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value
    }

    // В остальных случаях возвращаем прочерк
    return '—'
  }

  if (isLoading) {return <div>Загрузка...</div>}
  if (error) {return <div>Ошибка: {error.message}</div>}
  if (!claims) {return <div>Нет данных</div>}

  return (
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <DataTable
        data={claims}
        columns={columns}
        pageSize={10}
        onRowDoubleClick={(row) => { handleDoubleClick(row.id); }}
        enableSearch
        searchableColumns={['description', 'numCourtCase', 'regNumIntDoc']}
        transformValue={transformValue}
      />
    </ClaimPageWrapper>
  )
}
