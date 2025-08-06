// webapp/src/auth/EditProfilePage/index.tsx

import type { AppRouter } from '@newclaim/backend/src/router'
import { zUpdatePasswordInput } from '@newclaim/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileInput } from '@newclaim/backend/src/router/auth/updateProfile/input'
import { zStringRequired, zPasswordsMustBeTheSame } from '@newclaim/shared/src/zod'
import { type inferProcedureOutput } from '@trpc/server'
import { useMemo } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { ClaimPageWrapper } from '../../components/PageWrappers/ClaimPageWrapper'
import { Segment } from '../../components/Segment'
import { useMe } from '../../lib/ctx'
import { useForm } from '../../lib/form'
import { trpc } from '../../trpc'

export const EditProfilePage = () => {
  const me = useMe()
  const trpcUtils = trpc.useUtils()

  const General = ({ me }: { me: inferProcedureOutput<AppRouter['claim']['getMe']>['me'] }) => {
    const updateProfile = trpc.authUpdateProfile.useMutation()

    if (!me || me === null) {
      throw new Error('Unexpected null me on EditProfilePage')
    }

    const initialValues = useMemo(() => ({
      nick: me.nick,
      name: me.name,
      avatar: me.avatar,
      userGroupID: me.userGroupID || '',
      cAct: me.cAct,
    }), [me.nick, me.name, me.avatar, me.userGroupID, me.cAct])

    const { formik, alertProps, buttonProps } = useForm({
      initialValues,
      validationSchema: zUpdateProfileInput,
      onSubmit: async (values) => {
        const updatedMe = await updateProfile.mutateAsync(values)
        trpcUtils.claim.getMe.setData(undefined, { me: updatedMe })
      },
      successMessage: 'Profile updated',
      resetOnSuccess: false,
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Name" name="name" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Profile</Button>
        </FormItems>
      </form>
    )
  }

  const Password = () => {
    const updatePassword = trpc.authUpdatePassword.useMutation()
    const { formik, alertProps, buttonProps } = useForm({
      initialValues: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
      },
      validationSchema: zUpdatePasswordInput
        .extend({
          newPasswordAgain: zStringRequired,
        })
        .superRefine(zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')),
      onSubmit: async ({ newPassword, oldPassword }) => {
        await updatePassword.mutateAsync({ newPassword, oldPassword })
      },
      successMessage: 'Password updated',
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Old password" name="oldPassword" type="password" formik={formik} />
          <Input label="New password" name="newPassword" type="password" formik={formik} />
          <Input label="New password again" name="newPasswordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Password</Button>
        </FormItems>
      </form>
    )
  }

  // =========== for wrapper
  const accessAllowed = !!me
  const titlePage = 'Edit My Profile'
  // =========== for wrapper

  return (
    <ClaimPageWrapper title={titlePage} accessAllowed={accessAllowed}>
      <Segment title="Edit My Profile">
        <Segment title="General" size={2}>
          <General me={me} />
        </Segment>
        <Segment title="Password" size={2}>
          <Password />
        </Segment>
      </Segment>
    </ClaimPageWrapper>
  )
}
