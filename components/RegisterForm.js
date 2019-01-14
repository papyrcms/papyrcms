import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../store'

class RegisterForm extends Component {

  constructor( props ) {

    super( props )

    this.state = { email: '', password: '', passwordConfirm: '', validationMessage: '' }
  }


  handleSubmit( event ) {

    event.preventDefault()

    const { email, password, passwordConfirm } = this.state
    let message = ''

    axios.post( '/api/register', { username: email, password, passwordConfirm })
      .then( res => {
        if ( res.data.error ) {
          message = res.data.error.message

          this.setState({ validationMessage: message })
        } else if ( res.data === 'success' ) {
          axios.get( '/api/currentUser' )
            .then( res => {
              this.props.setCurrentUser( res.data )
              Router.push( '/profile' )
            }).catch( err => {
              message = err.response.data.message

              this.setState({ validationMessage: message })
            });
        }
      }).catch( err => {
        message = err.response.data.message

        this.setState({ validationMessage: message })
      });
  }


  render() {

    const { email, password, passwordConfirm, validationMessage } = this.state

    return (
      <form onSubmit={ this.handleSubmit.bind( this ) } className={ this.props.className }>
        <h3 className="heading-tertiary u-margin-bottom-small">Register</h3>

        <label className="login-page__label" htmlFor='email_register_input'>Email</label>
        <input
          type='text'
          name='email'
          id='email_register_input'
          className="login-page__input"
          value={ email }
          onChange={ event => this.setState({ email: event.target.value }) }
        />

        <label className="login-page__label" htmlFor='password_register_input'>Password</label>
        <input
          type='password'
          name='password'
          className="login-page__input"
          value={ password }
          onChange={event => this.setState({ password: event.target.value }) }
        />

        <label className="login-page__label" htmlFor='password_confirm_register_input'>Confirm Password</label>
        <input
          type='password'
          name='passwordConfirm'
          className="login-page__input"
          value={ passwordConfirm }
          onChange={event => this.setState({ passwordConfirm: event.target.value }) }
        />

        <p className="login-page__validation">{ validationMessage }</p>

        <div className="login-page__submit">
          <input
            type='submit'
            value='Register'
            className='button button-secondary'
          />
        </div>
      </form>
    )
  }
}


export default connect( null, { setCurrentUser })( RegisterForm )
