import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'


class AdminLinks extends Component {

  renderStoreMenuItems() {

    const { settings } = this.props

    if (settings.enableStore) {
      return (
        <Fragment>
          <Link href="/store_create" as="/store/new">
            <a className="admin-page__link">Add Product</a>
          </Link>

          <Link href="/store_all" as="/store">
            <a className="admin-page__link">My Products</a>
          </Link>
        </Fragment>
      )
    }
  }


  renderBlogMenuItems() {

    const { settings } = this.props

    if (settings.enableBlog) {
      return (
        <Fragment>
          <Link href="/blog_create" as="/blog/new">
            <a className="admin-page__link">Add Blog</a>
          </Link>

          <Link href="/blog_all" as="/blog/all">
            <a className="admin-page__link">My Blogs</a>
          </Link>
        </Fragment>
      )
    }
  }


  renderEventMenuItems() {

    const { settings } = this.props

    if (settings.enableEvents) {
      return (
        <Fragment>
          <Link href="/events_create" as="/events/new">
            <a className="admin-page__link">Add Event</a>
          </Link>

          <Link href="/events_all" as="/events/all">
            <a className="admin-page__link">My Events</a>
          </Link>
        </Fragment>
      )
    }
  }


  render() {

    return (
      <Fragment>
        <Link href="/posts_create" as="/posts/new">
          <a className="admin-page__link">Add Content</a>
        </Link>

        <Link href="/posts_all" as="/posts">
          <a className="admin-page__link">My Content</a>
        </Link>

        {this.renderBlogMenuItems()}
        {this.renderEventMenuItems()}
        {this.renderStoreMenuItems()}
      </Fragment>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps)(AdminLinks)
