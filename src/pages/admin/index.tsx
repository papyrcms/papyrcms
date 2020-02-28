import React, { useContext } from 'react'
import userContext from '../../context/userContext'
import AdminDashboard from '../../components/AdminDashboard'


const AdminPage = () => {

  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  return (
    <div className="admin-page">
      <h2 className="heading-secondary admin-page__title">Admin Dashboard</h2>
      <AdminDashboard />
    </div>
  )
}


export default AdminPage
