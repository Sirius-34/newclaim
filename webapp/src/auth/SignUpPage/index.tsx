import { zSignUpInput } from '@newclaim/backend/src/router/auth/signUp/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@newclaim/shared/src/zod'
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

export const SignUpPage = () => {
  const trpcUtils = trpc.useUtils()
  const navigate = useNavigate()

  const signUp = trpc.claim.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate().then(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(getClaimListRoute())
      })
    },
    successMessage: 'Thanks for Sign Up!',
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign Up">
      {useTitle('Sign Up')}
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="E-Mail" name="email" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
