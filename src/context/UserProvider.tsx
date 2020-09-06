import { User } from 'types'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userContext from './userContext'


const UserProvider = (props: { children: any }) => {

  const [currentUser, setUser] = useState<User | null>(null)

  const setCurrentUser = async (user?: User) => {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`
    }
    if (!user) {
      const result = await axios.get('/api/auth/currentUser')
      user = result.data
    }
    if (user) setUser(user)
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
