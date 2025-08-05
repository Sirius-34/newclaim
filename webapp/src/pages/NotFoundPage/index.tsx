// webapp/src/pages/NotFoundPage/index.tsx
 
import image404 from '../../assets/images/404.jpg'
import { ErrorPageComponent } from '../../components/ErrorPageComponent'
import css from './index.module.css'

export const NotFoundPage = ({
  title = 'Not Found',
  message = 'This page does not exist',
}: {
  title?: string
  message?: string
}) => (
  <ErrorPageComponent title={title} message={message}>
    <img src={image404} className={css.image} alt="" width="409" height="614" />
  </ErrorPageComponent>
)
