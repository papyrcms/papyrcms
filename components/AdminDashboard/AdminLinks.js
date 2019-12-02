import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'


const renderStoreMenuItems = enableStore => {

  if (enableStore) {
    return (
      <Fragment>
        <Link href="/store/new">
          <a className="admin-links__link">Add Product</a>
        </Link>

        <Link href="/store">
          <a className="admin-links__link">My Products</a>
        </Link>
      </Fragment>
    )
  }
}


const renderBlogMenuItems = enableBlog => {

  if (enableBlog) {
    return (
      <Fragment>
        <Link href="/blog/new">
          <a className="admin-links__link">Add Blog</a>
        </Link>

        <Link href="/blog/all">
          <a className="admin-links__link">My Blogs</a>
        </Link>
      </Fragment>
    )
  }
}


const renderEventMenuItems = enableEvents => {

  if (enableEvents) {
    return (
      <Fragment>
        <Link href="/events/new">
          <a className="admin-links__link">Add Event</a>
        </Link>

        <Link href="/events/all">
          <a className="admin-links__link">My Events</a>
        </Link>
      </Fragment>
    )
  }
}


const AdminLinks = props => {

  const { enableEvents, enableBlog, enableStore } = props.settings

  return (
    <Fragment>
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

      {renderBlogMenuItems(enableBlog)}
      {renderEventMenuItems(enableEvents)}
      {renderStoreMenuItems(enableStore)}
    </Fragment>
  )
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps)(AdminLinks)
