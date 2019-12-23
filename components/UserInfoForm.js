import React, { Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'
import useForm from '../hooks/useForm'
import Input from './Input'


const UserInfoForm = props => {

  let {
    currentUser,
    beforeSubmit = () => null,
    onSubmitError = () => null,
    onSubmitSuccess = () => null,
    children,
    useSubmit = true
  } = props

  const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',

    shippingFirstName: '',
    shippingLastName: '',
    shippingEmail: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',

    shipToBilling: true
  }

  // Set currentUser attributes
  if (currentUser) {
    for (const state in INITIAL_STATE) {
      if (state in currentUser) {
        INITIAL_STATE[state] = currentUser[state]
      }
    }
  }

  const formState = useForm(INITIAL_STATE)

  const handleSubmit = async event => {
    event.preventDefault()

    const success = () => {
      if (currentUser) {
        axios.get('/api/currentUser')
          .then(res => {
            setCurrentUser(res.data)
            onSubmitSuccess(formState, res.data)
          }).catch(err => {
            console.error(err)
            onSubmitError(formState, err)
          })
      } else {
        onSubmitSuccess(formState)
      }
    }

    const error = err => {
      onSubmitError(formState, err)
    }

    beforeSubmit(formState)

    formState.submitForm(
      '/api/currentUser',
      { success, error },
      true,
      { userId: currentUser._id }
    )
  }

  const renderAddressFields = shipping => {

    if (shipping && formState.values.shipToBilling) {
      return null
    }

    return (
      <Fragment>
        <div className="u-form-row">
          <Input
            name={`${shipping ? 'shippingF' : 'f'}irstName`}
            label={`${shipping ? 'Shipping ' : ''}First Name`}
            formState={formState}
            required
          />

          <Input
            name={`${shipping ? 'shippingL' : 'l'}astName`}
            label={`${shipping ? 'Shipping ' : ''}Last Name`}
            formState={formState}
            required
          />

          <Input
            name={`${shipping ? 'shippingE' : 'e'}mail`}
            label={`${shipping ? 'Shipping ' : ''}Email`}
            type="email"
            formState={formState}
            required
          />
        </div>

        <div className="u-form-row">
          <Input
            name={`${shipping ? 'shippingA' : 'a'}ddress1`}
            label={`${shipping ? 'Shipping ' : ''}Address (line 1)`}
            formState={formState}
            required
          />

          <Input
            name={`${shipping ? 'shippingA' : 'a'}ddress2`}
            label={`${shipping ? 'Shipping ' : ''}Address (line 2)`}
            formState={formState}
          />
        </div>

        <div className="u-form-row">
          <Input
            name={`${shipping ? 'shippingC' : 'c'}ity`}
            label={`${shipping ? 'Shipping ' : ''}City`}
            formState={formState}
            required
          />

          <Input
            name={`${shipping ? 'shippingS' : 's'}tate`}
            label={`${shipping ? 'Shipping ' : ''}State`}
            formState={formState}
            required
          />
        </div>

        <div className="u-form-row">
          <Input
            name={`${shipping ? 'shippingZ' : 'z'}ip`}
            label={`${shipping ? 'Shipping ' : ''}Zip`}
            formState={formState}
            required
          />

          <Input
            name={`${shipping ? 'shippingC' : 'c'}ountry`}
            label={`${shipping ? 'Shipping ' : ''}Country`}
            formState={formState}
            required
          />
        </div>
      </Fragment>
    )
  }

  const renderSubmit = () => {
    if (useSubmit) {
      return <input
        className="button button-primary"
        type="submit"
      />
    }
  }

  return (
    <form onSubmit={handleSubmit} id="userInfoForm">
      {renderAddressFields(false)}

      <Input
        type="checkbox"
        label="Ship to Billing Address"
        name="shipToBilling"
        formState={formState}
      />

      {renderAddressFields(true)}

      {children}

      {renderSubmit()}
    </form>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setCurrentUser })(UserInfoForm)
