import { FC } from 'react'
import styles from './Tooltip.module.scss'

const Tooltip: FC = ({ children }) => {
  return (
    <span className={styles.wrapper}>
      <i
        aria-hidden="true"
        className={`fas fa-info-circle ${styles.icon}`}
      ></i>
      <div className={styles.container}>{children}</div>
    </span>
  )
}

export default Tooltip
