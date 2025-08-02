// webapp/src/components/FileUploader/UploadedFilesList.tsx

import { trpc } from '../../trpc'

export const UploadedFilesList = ({ claimId }: { claimId: string }) => {
  const { data, isLoading } = trpc.claim.getDocumentsByClaimId.useQuery(claimId)

  if (isLoading) {
    return <p>Загрузка файлов...</p>
  }
  if (!data || data.length === 0) {
    return <p>Файлы не загружены</p>
  }

  return (
    <ul>
      {data.map((doc) => (
        <li key={doc.id}>
          {doc.name} ({Math.round(doc.size / 1024)} КБ)
        </li>
      ))}
    </ul>
  )
}
