import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import ContactForm from '../components/ContactForm'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'
import keys from '../config/keys'

const ContactPage = props => (
  <Fragment>
    <PostsFilter
      component={SectionStandard}
      posts={props.posts}
      settings={{ maxPosts: 1, postTags: ['contact'] }}
      componentProps={{ title: 'Contact' }}
    />
    <div className="contact-page">
      <ContactForm />
    </div>
  </Fragment>
)


ContactPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const posts = await axios.get(`${rootUrl}/api/published_posts`)

  return { posts: posts.data }
}


const mapStateToProps = state => {
  return { posts: state.posts }
}


export default connect(mapStateToProps)(ContactPage)
