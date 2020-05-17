import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userContext from './userContext'

const UserProvider = (props) => {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common = {
          Authorization: `bearer ${token}`
        }
        const { data: user } = await axios.get('/api/auth/currentUser')
        setCurrentUser(user)
      }
    }
    getCurrentUser()
  }, [])

  return (
    <userContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      {props.children}
    </userContext.Provider>
  )
}

export default UserProvider
