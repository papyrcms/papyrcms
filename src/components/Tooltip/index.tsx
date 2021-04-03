import { FC } from 'react'
import PageHead from '../PageHead'
import styles from './Tooltip.module.scss'

interface Props {
  text: string
}

const Tooltip: FC<Props> = ({ text }) => {
  return (
    <span className={styles.wrapper}>
      <PageHead>
        <script
          src="https://kit.fontawesome.com/6d08f4a1f7.js"
          crossOrigin="anonymous"
        ></script>
      </PageHead>
      <i
        aria-hidden="true"
        className={`fas fa-info-circle ${styles.icon}`}
      ></i>
      <div className={styles.container}>{text}</div>
    </span>
  )
}

export default Tooltip
