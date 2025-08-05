// webapp/src/pages/UnauthorizedPage/index.tsx

import { Link } from 'react-router-dom'
import image401 from '../../assets/images/401.jpg'
import { ErrorPageComponent } from '../../components/ErrorPageComponent'
import css from './index.module.css'

export const UnauthorizedPage = ({
  title = 'Unauthorized User Access',
  message = 'We are sorry, but access is only for authorized users! Извините, но доступ осуществляется только для авторизованных пользователей!',
}: {
  title?: string
  message?: string
}) => (
  <ErrorPageComponent title={title} message={message}>
    <Link to="/">
      <img src={image401} className={css.image} alt="" width="409" height="614" />
    </Link>
  </ErrorPageComponent>
)
