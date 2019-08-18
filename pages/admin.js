import React from 'react'
import axios from 'axios'
import keys from '../config/keys'
import AdminDashboard from '../components/AdminDashboard'


const AdminPage = () => (
  <div className="admin-page">

    <h2 className="heading-secondary admin-page__title">Admin Dashboard</h2>

    <AdminDashboard />

  </div>
)

AdminPage.getInitialProps = async ({ req }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''

  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  const userRes = await axios.get(`${rootUrl}/api/users`, axiosConfig)
  const users = userRes.data

  const messageRes = await axios.get(`${rootUrl}/api/messages`, axiosConfig)
  const messages = messageRes.data

  return { users, messages }
}

export default AdminPage
