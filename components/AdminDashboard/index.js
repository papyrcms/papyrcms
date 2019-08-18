import React from 'react'
import AdminLinks from './AdminLinks'
import AppSettingsForm from './AppSettingsForm'
import UserList from './UserList'
import MessageList from './MessageList'


export default () => (
  <div className="admin-page__dashboard">

    <div className="admin-page__links">
      <AdminLinks />
    </div>

    <div className="admin-page__forms">
      <AppSettingsForm />
      <UserList />
      <MessageList />
    </div>
  </div>
)
