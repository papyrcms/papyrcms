import React, { useEffect } from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import { setMessages } from '../../reduxStore'
import Modal from '../Modal'


const MessageList = props => {

  const { messages, setMessages } = props
  useEffect(() => {
    const getMessages = async () => {
      const { data: messages } = await axios.get('/api/messages')
      setMessages(messages)
    }
    getMessages()
  }, [])


  const deleteMessage = id => {

    const confirm = window.confirm("Are you sure you want to delete this message?")

    if (confirm) {

      axios.delete(`/api/messages/${id}`)
        .then(res => {

          const newMessages = messages.filter(message => message._id !== id)
          setMessages(newMessages)

        }).catch(err => {
          console.error(err)
        })
    }
  }


  const renderMessages = () => {

    return messages.map(mess => {

      const { name, email, message, created, _id } = mess

      return (
        <div key={_id} className="message-list__message">
          <p className="message-list__date">Sent: {moment(created).tz('America/Chicago').format('MMMM Do, YYYY')}</p>

          <div className="message-list__info">
            <span className="message-list__info--name">From: {name}</span>
            <span className="message-list__info--email">Email: {email}</span>
          </div>

          <div className="message-list__content">
            {message}
          </div>

          <button
            className="button button-tertiary button-small"
            onClick={() => deleteMessage(_id)}
          >
            Delete
          </button>
        </div>
      )
    })
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


const mapStateToProps = state => {
  return { messages: state.messages }
}


export default connect(mapStateToProps, { setMessages })(MessageList)
