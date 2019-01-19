import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import SectionStandard from '../components/SectionStandard'

class ServicesPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const posts = await axios.get(`${rootUrl}/api/published_posts`)

    return { posts: posts.data }
  }


  render() {

    const { servicesPageSettings } = this.props.settings

    const componentProps = { 
      title: 'Services', 
      className: 'services-page'
    }

    return (
      <PostsFilter
        component={ SectionStandard }
        posts={ this.props.posts }
        settings={ servicesPageSettings }
        componentProps={ componentProps }
      />
    )
  }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings }
}


export default connect( mapStateToProps )( ServicesPage )
