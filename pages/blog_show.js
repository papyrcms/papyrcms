import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostShow from '../components/PostShow'

class BlogShow extends Component {

  static async getInitialProps(context) {

    const { id } = context.query
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const blog = await axios.get(`${rootUrl}/api/blogs/${id}`)

    return { blog: blog.data }
  }


  render() {

    const { currentUser, blog, settings } = this.props

    return (
      <PostShow
        currentUser={currentUser}
        post={blog}
        settings={settings}
        enableCommenting={true}
        path="blog"
        apiPath="blogs"
      />
    )
  }
}

const mapStateToProps = state => {
  const { currentUser, blog, settings } = state

  return { currentUser, blog, settings }
}


export default connect(mapStateToProps)(BlogShow)
