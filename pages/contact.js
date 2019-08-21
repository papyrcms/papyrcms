import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ContactForm from '../components/ContactForm'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

const ContactPage = props => {

  let message

  // This is a custom message for a query param
  if (props.url && props.url.query && props.url.query.reason) {
    switch (props.url.query.reason) {
      case 'tutoring':
        message = 'Hello Derek, I am interested in private tutoring.\n\nSome times through the week that work best for me include:\n\n{ include some times that work best for you }\n\nbut my overall availability is:\n\n{ enter your overall availability }\n\n{ Let me know anything else that you think might be helpful like your current skill level, your goals, or anything else }'
        break
      default: null
    }
    
    // This is an actual feature
  } else if (props.url && props.url.query && props.url.query.initialMessage) {
    message = decodeURIComponent(props.url.query.initialMessage)
  }

  return (
    <Fragment>
      <PostsFilter
        component={SectionStandard}
        posts={props.posts}
        settings={{ maxPosts: 1, postTags: ['contact'] }}
        componentProps={{
          title: 'Contact',
        }}
      />
      <div className="contact-page">
        <ContactForm 
          initialMessage={message}
        />
      </div>
    </Fragment>
  )
}


const mapStateToProps = state => {
  return { posts: state.posts, url: state.url }
}


export default connect(mapStateToProps)(ContactPage)
