import { useState } from 'react'
import { trpc } from '../../trpc'

type FileUploaderProps = {
  parentId: string // например, claimId
  onUploaded?: (documentId: string) => void
  onComplete?: () => void
  accept?: string
  maxSizeMb?: number
}

export const FileUploader = ({
  parentId,
  onUploaded,
  onComplete,
  accept = '*/*',
  maxSizeMb = 5,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const uploadDocument = trpc.claim.createDocument.useMutation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selected = e.target.files?.[0]
    if (!selected) {
      return
    }

    if (selected.size > maxSizeMb * 1024 * 1024) {
      setError(`Файл превышает максимальный размер ${maxSizeMb} МБ`)
      setFile(null)
      return
    }

    setFile(selected)
  }

  const handleUpload = async () => {
    if (!file) {
      return
    }
    setUploading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      const result = await uploadDocument.mutateAsync({
        claimId: parentId,
        name: file.name,
        mimeType: file.type,
        data: uint8Array,
      })

      setFile(null)
      onUploaded?.(result.id)
      onComplete?.()
    } catch (err) {
      setError('Ошибка при загрузке файла')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <input type="file" accept={accept} onChange={handleFileChange} disabled={uploading} />

      {file && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>{file.name}</strong>{' '}
          <button
            type="button"
            onClick={() => {
              void handleUpload()
            }}
            disabled={uploading}
          >
            {uploading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  )
}
