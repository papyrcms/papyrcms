import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment-timezone'
import { setMessages } from '../../reduxStore'
import Modal from '../Modal'


class MessageList extends Component {

  deleteMessage(id) {

    const confirm = window.confirm("Are you sure you want to delete this message?")

    if (confirm) {

      const { messages, setMessages } = this.props

      axios.delete(`/api/messages/${id}`)
        .then(res => {
          messages.forEach((message, i) => {

            if (message._id === id) {
              let newMessages = [...messages]
              newMessages.splice(i, 1)

              setMessages(newMessages)
            }
          })

        }).catch(err => {
          console.error(err)
        })
    }
  }


  renderMessages() {

    const { messages } = this.props

    return messages.map(mess => {

      const { name, email, message, created, _id } = mess

      return (
        <div key={_id} className="message-section__message">
          <p className="message-section__date">Sent: {moment(created).tz('America/Chicago').format('MMMM Do, YYYY')}</p>

          <div className="message-section__info">
            <span className="message-section__info--name">From: {name}</span>
            <span className="message-section__info--email">Email: {email}</span>
          </div>

          <div className="message-section__content">
            {message}
          </div>

          <button
            className="button button-tertiary button-small"
            onClick={() => this.deleteMessage(_id)}
          >
            Delete
          </button>
        </div>
      )
    })
  }


  render() {

    return (
      <Modal
        buttonClasses="button button-primary"
        buttonText={`View Messages (${this.props.messages.length})`}
      >
        <div className="messages-section">
          <h3 className="heading-tertiary">Messages</h3>
          {this.renderMessages()}
        </div>
      </Modal>
    )
  }
}


const mapStateToProps = state => {
  return { messages: state.messages }
}


export default connect(mapStateToProps, { setMessages })(MessageList)
