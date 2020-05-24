import React, { useContext } from 'react'
import Link from 'next/link'
import settingsContext from '@/context/settingsContext'


const AdminLinks = () => {

  const { settings } = useContext(settingsContext)

  const renderStoreMenuItems = () => {
    if (settings.enableStore) {
      return (
        <>
          <Link href="/store/new">
            <a className="admin-links__link">Add Product</a>
          </Link>

          <Link href="/store">
            <a className="admin-links__link">My Products</a>
          </Link>

          <Link href="/store/orders">
            <a className="admin-links__link">Orders</a>
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
            <a className="admin-links__link">Add Blog</a>
          </Link>

          <Link href="/blog/all">
            <a className="admin-links__link">My Blogs</a>
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
            <a className="admin-links__link">Add Event</a>
          </Link>

          <Link href="/events/all">
            <a className="admin-links__link">My Events</a>
          </Link>
        </>
      )
    }
  }


  return (
    <>
      <Link href="/admin/page-builder">
        <a className="admin-links__link">Page Builder</a>
      </Link>

      <Link href="/admin/pages">
        <a className="admin-links__link">My Pages</a>
      </Link>

      <Link href="/posts/new">
        <a className="admin-links__link">Add Content</a>
      </Link>

      <Link href="/posts">
        <a className="admin-links__link">My Content</a>
      </Link>

      {renderBlogMenuItems()}
      {renderEventMenuItems()}
      {renderStoreMenuItems()}
    </>
  )
}


export default AdminLinks
