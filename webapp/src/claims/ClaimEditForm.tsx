// webapp/src/claims/ClaimEditForm.tsx

import { claimEditSchema, type ClaimFormData } from '@newclaim/shared/src/schemas/claim'
import cn from 'classnames'
import { Formik, Form, Field } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '../components/Button'
import { FileUploader } from '../components/FileUploader'
import { UploadedFilesList } from '../components/FileUploader/UploadedFilesList'
import { trpc } from '../trpc'
import css from './ClaimEditForm.module.scss'
import but from './index.module.scss'

export const ClaimEditForm = ({
  initialValues,
  onSubmit,
  claimId,
}: {
  initialValues: ClaimFormData
  onSubmit: (values: ClaimFormData) => void | Promise<void>
  claimId?: string
}) => {
  const utils = trpc.useUtils()
  const handleUploaded = () => {
    void utils.claim.getDocumentsByClaimId.invalidate(claimId)
}
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(claimEditSchema)}
      onSubmit={onSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.fieldWrapper}>
            <label>Краткое описание</label>
            <Field
              name="description"
              as="textarea"
              className={cn(css.field, {
                [css.valid]: touched.description && !errors.description,
                [css.invalid]: touched.description && errors.description,
              })}
              placeholder="до 200 символов"
            />
            {touched.description && errors.description && <div className={css.error}>{errors.description}</div>}
          </div>

          <div className={css.fieldWrapper}>
            <label>Полное описание</label>
            <Field
              name="text"
              as="textarea"
              className={cn(css.field, {
                [css.valid]: touched.text && !errors.text,
                [css.invalid]: touched.text && errors.text,
              })}
              placeholder="Введите подробности..."
            />
            {touched.text && errors.text && <div className={css.error}>{errors.text}</div>}
          </div>

          <div className={css.fieldWrapper}>
            <label>Числовое поле (необязательно)</label>
            <Field name="numberField" type="number" className={css.field} />
          </div>

          <div className={css.fieldWrapper}>
            <label>Дата и время (необязательно)</label>
            <Field name="datetimeField" type="datetime-local" className={css.field} />
          </div>

          {claimId && (
            <div className={css.fieldWrapper}>
              <label>Документы</label>
              <UploadedFilesList claimId={claimId} />
              <FileUploader parentId={claimId} onUploaded={handleUploaded} />
            </div>
          )}
          
          <div className={but.backButton}>
            <Button type="submit" loading={isSubmitting}>
              Сохранить
            </Button>
          </div>
        </Form>
      )}
    </Formik>
    
  )
}
