// webapp/src/auth/SignInPage/index.tsx

import { zSignInInput } from '@newclaim/backend/src/router/auth/signIn/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { useForm } from '../../lib/form'
import { getClaimListRoute } from '../../lib/routes'
import { useTitle } from '../../lib/useTitle'
import { trpc } from '../../trpc'

export const SignInPage = () => {
  const trpcUtils = trpc.useUtils()
  const navigate = useNavigate()

  const signIn = trpc.claim.signIn.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInInput,
    onSubmit: async (values) => {
      const { token } = await signIn.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate().then(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(getClaimListRoute())
      })
    },
    successMessage: 'Sign In Succesful',
  })

  return (
    <Segment title="Sign In">
      {useTitle('Sign In')}
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign In</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
