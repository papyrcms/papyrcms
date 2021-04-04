import React from 'react'
import AdminLinks from './AdminLinks'
import AppSettingsForm from './AppSettingsForm'
import UserList from './UserList'
import MessageList from './MessageList'
import styles from './AdminDashboard.module.scss'

const AdminDashboard = () => (
  <div className={styles.container}>
    <div className={styles.left}>
      <AdminLinks />
    </div>

    <div className={styles.right}>
      <AppSettingsForm />
      <UserList />
      <MessageList />
    </div>
  </div>
)

export default AdminDashboard
