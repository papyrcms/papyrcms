import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import ContactForm from '../components/ContactForm'
import PostsFilter from '../components/PostsFilter'
import SectionStandard from '../components/SectionStandard'
import keys from '../config/keys'

class Contact extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get(`${rootUrl}/api/published_posts`)

    return { posts: posts.data }
  }


  render() {

    return (
      <Fragment>
        <PostsFilter
          component={SectionStandard}
          posts={this.props.posts}
          settings={{ maxPosts: 1, postTags: ['contact'] }}
          componentProps={{ title: 'Contact' }}
        />
        <div className="contact-page">
          <ContactForm />
        </div>
      </Fragment>
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(Contact)
