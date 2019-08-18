import React from 'react'
import AdminLinks from './AdminLinks'
import AppSettingsForm from './AppSettingsForm'
import UserList from './UserList'
import MessageList from './MessageList'


export default () => (
  <div className="admin-page__dashboard">

    <div className="admin-page__left">
      <AdminLinks />
    </div>

    <div className="admin-page__right">
      <AppSettingsForm />
      <UserList />
      <MessageList />
    </div>
  </div>
)
