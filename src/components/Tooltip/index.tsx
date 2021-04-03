import { FC } from 'react'
import styles from './Tooltip.module.scss'

interface Props {
  text: string
}

const Tooltip: FC<Props> = ({ text }) => {
  return (
    <span className={styles.wrapper}>
      <i
        aria-hidden="true"
        className={`fas fa-info-circle ${styles.icon}`}
      ></i>
      <div className={styles.container}>{text}</div>
    </span>
  )
}

export default Tooltip
