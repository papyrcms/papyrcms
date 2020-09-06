import { Message } from 'types'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import Modal from '../Modal'
import userContext from '@/context/userContext'

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const { currentUser } = useContext(userContext)
  useEffect(() => {
    const getMessages = async () => {
      if (currentUser && currentUser.isAdmin) {
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
          const newMessages = _.filter(
            messages,
            (message) => message._id !== id
          )
          setMessages(newMessages)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const renderMessages = () => {
    return _.map(
      messages,
      ({ name, email, message, created, _id }) => {
        const localReadableDate = moment(created).format('LLLL')

        return (
          <div key={_id} className="message-list__message">
            <p className="message-list__date">
              Sent: {localReadableDate}
            </p>

            <div className="message-list__info">
              <span className="message-list__info--name">
                From: {name}
              </span>
              <span className="message-list__info--email">
                Email: {email}
              </span>
            </div>

            <div className="message-list__content">{message}</div>

            <button
              className="button button-tertiary button-small"
              onClick={() => deleteMessage(_id)}
            >
              Delete
            </button>
          </div>
        )
      }
    )
  }

  return (
    <Modal
      buttonClasses="button button-primary"
      buttonText={`View Messages (${messages.length})`}
    >
      <div className="message-list">
        <h3 className="heading-tertiary">Messages</h3>
        {renderMessages()}
      </div>
    </Modal>
  )
}

export default MessageList
