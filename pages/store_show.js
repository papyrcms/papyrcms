import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import PostShow from '../components/PostShow'

class StoreShow extends Component {

  static async getInitialProps( context ) {

    const { id } = context.query
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const post = await axios.get( `${rootUrl}/api/posts/${id}` )

    return { post: post.data }
  }


  render() {

    const { currentUser, post, settings } = this.props

    return (
      <PostShow
        currentUser={ currentUser }
        post={ post }
        settings={ settings }
        enableCommenting={ false }
      />
    )
  }
}


const mapStateToProps = state => {
  const { currentUser, post, settings } = state

  return { currentUser, post, settings }
}


export default connect( mapStateToProps )( StoreShow )
