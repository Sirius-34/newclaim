import type { AppRouter } from '@newclaim/backend/src/router'
import { zUpdatePasswordTrpcInput } from '@newclaim/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileTrpcInput } from '@newclaim/backend/src/router/auth/updateProfile/input'
import { zStringRequired, zPasswordsMustBeTheSame } from '@newclaim/shared/src/zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { useForm } from '../../lib/form'
import { trpc } from '../../trpc'
import css from './index.module.scss'

const General = ({ me }: { me: NonNullable<AppRouter['getMe']['me']> }) => {
  const trpcUtils = trpc.useUtils()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
//      avatar: me.avatar,
      userGroupID: me.userGroupID || '',
      cAct: me.cAct,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })

  const { data: groups } = trpc.sprUserGroup.list.useQuery()

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Nick" name="nick" formik={formik} />
        <Input label="Name" name="name" formik={formik} />
        <UploadToCloudinary label="Avatar" name="avatar" type="avatar" preset="big" formik={formik} />

        <div>
          <select name="userGroupID" onChange={formik.handleChange} value={formik.values.userGroupID}>
            <option value="">Select a user group</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.cUserGroupName}
              </option>
            ))}
          </select>
        </div>

        <Alert {...alertProps} />
        <Button {...buttonProps}>Update Profile</Button>
      </FormItems>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
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

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Edit Profile',
})(({ me }) => {
  return (
    <Segment title="Edit Profile">
      <Segment title="General" size={2}>
        <General me={me} />
      </Segment>
      <Segment title="Password" size={2}>
        <Password />
      </Segment>
    </Segment>
  )
})
