import React from 'react'
import AdminLinks from './AdminLinks'
import AppSettingsForm from './AppSettingsForm'
import UserList from './UserList'
import MessageList from './MessageList'


export default () => (
  <div className="admin-dashboard">

    <div className="admin-dashboard__left">
      <AdminLinks />
    </div>

    <div className="admin-dashboard__right">
      <AppSettingsForm />
      <UserList />
      <MessageList />
    </div>
  </div>
)
