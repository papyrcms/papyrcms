import React, { useContext } from 'react'
import Link from 'next/link'
import { settingsContext } from '@/context'
import styles from './AdminLinks.module.scss'

const AdminLinks: React.FC = () => {
  const { settings } = useContext(settingsContext)

  const renderStoreMenuItems = () => {
    if (settings.enableStore) {
      return (
        <>
          <Link href="/store/new">
            <a className={styles.link}>Add Product</a>
          </Link>

          <Link href="/store">
            <a className={styles.link}>My Products</a>
          </Link>

          <Link href="/store/orders">
            <a className={styles.link}>Orders</a>
          </Link>
        </>
      )
    }
  }

  const renderBlogMenuItems = () => {
    if (settings.enableBlog) {
      return (
        <>
          <Link href="/blog/new">
            <a className={styles.link}>Add Blog</a>
          </Link>

          <Link href="/blog/all">
            <a className={styles.link}>My Blogs</a>
          </Link>
        </>
      )
    }
  }

  const renderEventMenuItems = () => {
    if (settings.enableEvents) {
      return (
        <>
          <Link href="/events/new">
            <a className={styles.link}>Add Event</a>
          </Link>

          <Link href="/events/all">
            <a className={styles.link}>My Events</a>
          </Link>
        </>
      )
    }
  }

  return (
    <>
      <Link href="/admin/page-builder">
        <a className={styles.link}>Page Builder</a>
      </Link>

      <Link href="/admin/pages">
        <a className={styles.link}>My Pages</a>
      </Link>

      <Link href="/posts/new">
        <a className={styles.link}>Add Content</a>
      </Link>

      <Link href="/posts">
        <a className={styles.link}>My Content</a>
      </Link>

      {renderBlogMenuItems()}
      {renderEventMenuItems()}
      {renderStoreMenuItems()}
    </>
  )
}

export default AdminLinks
