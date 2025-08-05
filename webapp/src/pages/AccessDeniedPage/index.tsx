// webapp/src/pages/AccessDeniedPage/index.tsx

import { Link } from 'react-router-dom'
import image403 from '../../assets/images/403.jpg'
import { ErrorPageComponent } from '../../components/ErrorPageComponent'
import css from './index.module.css'

export const AccessDeniedPage = ({
  title = 'Forbidden Access',
  message = 'We are sorry, but you do not have access to this page or resource! Извините, но у Вас недостаточно прав для доступа к данной странице или ресурсу!',
}: {
  title?: string
  message?: string
}) => (
  <ErrorPageComponent title={title} message={message}>
    <Link to="/">
      <img src={image403} className={css.image} alt="" width="409" height="614" />
    </Link>
  </ErrorPageComponent>
)
