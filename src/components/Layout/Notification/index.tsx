import { Post } from 'types'
import React, { useState, useEffect } from 'react'
import renderHTML from 'react-render-html'
import styles from './Notification.module.scss'

type Props = {
  post: Post
}

const Notification: React.FC<Props> = (props) => {
  const { post } = props
  const { _id, title, content } = post
  const [hidden, setHidden] = useState(true)

  const [closedNotifications, setClosedNotifications] = useState<
    string[]
  >([])

  useEffect(() => {
    let localClosedNotificationsJson = localStorage.getItem(
      'closedNotifications'
    )

    let localClosedNotifications

    if (!localClosedNotificationsJson) {
      localStorage.setItem('closedNotifications', JSON.stringify([]))
      localClosedNotifications = []
    } else {
      localClosedNotifications = JSON.parse(
        localClosedNotificationsJson
      )
      setClosedNotifications(localClosedNotifications)
    }

    if (!localClosedNotifications.includes(_id)) {
      setHidden(false)
    }
  }, [])

  const closeNotification = () => {
    const newClosedNotifications = [...closedNotifications, _id]
    setHidden(true)
    setClosedNotifications(newClosedNotifications)
    localStorage.setItem(
      'closedNotifications',
      JSON.stringify(newClosedNotifications)
    )
  }

  return (
    <div
      className={`${styles.container} ${hidden ? styles.hidden : ''}`}
    >
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.text}>{renderHTML(content)}</div>
      </div>
      <button className={styles.close} onClick={closeNotification}>
        &#10005;
      </button>
    </div>
  )
}

export default Notification
