import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userContext from './userContext'

type Props = {
  children: any
}

const UserProvider = (props: Props) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)

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
