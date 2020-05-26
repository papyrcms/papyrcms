import React, { useContext } from 'react'
import userContext from '@/context/userContext'
import AdminDashboard from '@/components/AdminDashboard'
import styles from './admin.module.scss'


const AdminPage = () => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  return (
    <div className={styles["admin-page"]}>
      <h2 className={`heading-secondary ${styles["admin-page__title"]}`}>Admin Dashboard</h2>
      <AdminDashboard />
    </div>
  )
}


export default AdminPage
