import { Post, Tags } from '@/types'
import React, { useState, useEffect } from 'react'
import styles from './Notification.module.scss'

type Props = {
  post: Post
}

const Notification: React.FC<Props> = (props) => {
  const { post } = props
  const { id, title, content } = post
  const [hidden, setHidden] = useState(true)
  const [storage, setStorage] = useState<Storage | null>(null)

  const [closedNotifications, setClosedNotifications] = useState<
    string[]
  >([])

  useEffect(() => {
    if (post.tags.includes(Tags.persist)) {
      setStorage(sessionStorage)
    } else {
      setStorage(localStorage)
    }
  }, [])

  useEffect(() => {
    if (!storage) return

    let localClosedNotificationsJson = storage.getItem(
      'closedNotifications'
    )

    let localClosedNotifications

    if (!localClosedNotificationsJson) {
      storage.setItem('closedNotifications', JSON.stringify([]))
      localClosedNotifications = []
    } else {
      localClosedNotifications = JSON.parse(
        localClosedNotificationsJson
      )
      setClosedNotifications(localClosedNotifications)
    }

    if (!localClosedNotifications.includes(id)) {
      setHidden(false)
    }
  }, [storage])

  const closeNotification = () => {
    const newClosedNotifications = [...closedNotifications, id]
    setHidden(true)
    setClosedNotifications(newClosedNotifications)
    storage?.setItem(
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
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <button className={styles.close} onClick={closeNotification}>
        &#10005;
      </button>
    </div>
  )
}

export default Notification
