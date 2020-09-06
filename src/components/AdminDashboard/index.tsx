import React from 'react'
import AdminLinks from './AdminLinks'
import AppSettingsForm from './AppSettingsForm'
import UserList from './UserList'
import MessageList from './MessageList'

const AdminDashboard = () => (
  <div className="admin-dashboard">
    <div className="admin-dashboard__left">
      <AdminLinks />
    </div>

    <div className="admin-dashboard__right">
      <AppSettingsForm />
      <UserList />
      <br />
      <MessageList />
    </div>
  </div>
)

export default AdminDashboard
