import Error from 'next/error'
import { useUser } from '@/context'
import { AdminDashboard } from '@/components'
import styles from './admin.module.scss'

const AdminPage = () => {
  const { currentUser } = useUser()
  if (!currentUser?.isAdmin) return <Error statusCode={403} />

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
