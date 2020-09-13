import React, { useContext } from 'react'
import Error from 'next/error'
import { userContext } from '@/context'
import { AdminDashboard } from '@/components'
import styles from './admin.module.scss'

const AdminPage = () => {
  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin)
    return <Error statusCode={403} />

  return (
    <div className={styles.main}>
      <h2 className={`heading-secondary ${styles.title}`}>
        Admin Dashboard
      </h2>
      <AdminDashboard />
    </div>
  )
}

export default AdminPage
