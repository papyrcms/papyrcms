import { useState } from 'react'
import axios from 'axios'


const useForm = (initialState: { [key: string]: any }) => {

  const initialErrors: { [key: string]: string } = {}

  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState(initialErrors)

  
  const handleChange = (event: any) => {
    const { type, checked, name, value } = event.target

    if (type && type === 'checkbox') {
      setValues({ ...values, [name]: checked })
    } else {
      setValues({ ...values, [name]: value })
    }
  }


  const validateField = (event: any) => {

    type Target = {
      type: string
      required: boolean
      value: any
      name: string 
    }
    const { type, required, value, name }: Target = event.target

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (required && !value) {
      setErrors({ ...errors, [name]: 'Please complete this field.' })
    } else if (type === 'email' && !regex.test(value.toLowerCase())) {
      setErrors({ ...errors, [name]: 'Please use a valid email address.' })
    } else if (type === 'password' && value.length < 6) {
      setErrors({ ...errors, [name]: 'Please use at least 6 characters in your password.' })
    } else if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }


  type Callbacks = {
    success?: Function
    error?: Function
  }


  const submitForm = async (url: string, callbacks: Callbacks = {}, update = false, additionalValues = {}, resetForm = true) => {

    const success = callbacks.success ? callbacks.success : () => null
    const error = callbacks.error ? callbacks.error : () => null

    try {

      const postValues = { ...values, ...additionalValues }

      const response = update
        ? await axios.put(url, postValues)
        : await axios.post(url, postValues)

      if (response.data.error) {
        throw response
      }

      const resetState = resetForm ? initialState : values
      success(response, (message: string) => setValues({ ...resetState, validation: message }))

    } catch (err) {

      let message = 'Something went wrong. Please try again.'

      if (
        err.data &&
        err.data.error &&
        err.data.error.message
      ) {
        message = err.data.error.message
      }

      setValues({ ...values, validation: message })
      error(err, (message: string) => setValues({ ...initialState, validation: message }))
    }
  }


  return { values, setValues, validateField, errors, handleChange, submitForm }
}


export default useForm
