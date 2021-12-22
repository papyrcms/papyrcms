import { Message } from '@/types'
import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Modal from '../../Modal'
import { useUser } from '@/context'
import styles from './MessageList.module.scss'

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const { currentUser } = useUser()
  useEffect(() => {
    const getMessages = async () => {
      if (currentUser?.isAdmin) {
        const { data: messages } = await axios.get('/api/messages')
        setMessages(messages)
      }
    }
    getMessages()
  }, [currentUser])

  const deleteMessage = (id: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this message?'
    )

    if (confirm) {
      axios
        .delete(`/api/messages/${id}`)
        .then((res) => {
          const newMessages = messages.filter(
            (message) => message.id !== id
          )
          setMessages(newMessages)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const renderMessages = () => {
    return messages.map(({ name, email, message, createdAt, id }) => {
      const localReadableDate = moment(createdAt).format('LLLL')

      return (
        <div key={id} className={styles.message}>
          <p>Sent: {localReadableDate}</p>

          <div className={styles.info}>
            <span>From: {name}</span>
            <span>Email: {email}</span>
          </div>

          <div className={styles.content}>{message}</div>

          <button
            className="button-tertiary button-small"
            onClick={() => deleteMessage(id)}
          >
            Delete
          </button>
        </div>
      )
    })
  }

  return (
    <Modal
      buttonClasses="button-primary"
      buttonText={`View Messages (${messages.length})`}
    >
      <div>
        <h3 className="heading-tertiary">Messages</h3>
        {renderMessages()}
      </div>
    </Modal>
  )
}

export default MessageList
