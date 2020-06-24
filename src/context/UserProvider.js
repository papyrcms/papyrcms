import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userContext from './userContext'

const UserProvider = (props) => {

  const [currentUser, setUser] = useState(null)

  const setCurrentUser = async user => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common = {
      Authorization: `bearer ${token}`
    }
    if (!user) {
      const result = await axios.get('/api/auth/currentUser')
      user = result.data
    }
    setUser(user)
  }

  useEffect(() => {
    setCurrentUser()
  }, [])

  return (
    <userContext.Provider
      value={{
        currentUser,
        setCurrentUser: setCurrentUser
      }}
    >
      {props.children}
    </userContext.Provider>
  )
}

export default UserProvider
