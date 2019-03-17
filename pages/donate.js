import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import DonateForm from '../components/DonateForm'
import PostsFilter from '../components/PostsFilter'

class Donate extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const stripePubKey = await axios.post(`${rootUrl}/api/stripePubKey`)
    const posts = await axios.get(`${rootUrl}/api/published_posts`)

    return { stripePubKey: stripePubKey.data, posts: posts.data }
  }


  constructor(props) {

    super(props)

    this.state = { stripe: null }
  }


  componentDidMount() {

    this.setState({ stripe: window.Stripe(this.props.stripePubKey) })
  }


  render() {

    const { posts, settings } = this.props

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          <PostsFilter
            component={DonateForm}
            posts={posts}
            settings={{ maxPosts: 1, postTags: 'donate' }}
            componentProps={{ title: "Donate" }}
          />
        </Elements>
      </StripeProvider>
    )
  }
}


const mapStateToProps = ({ stripePubKey, settings, posts }) => {
  return { stripePubKey, settings, posts }
}


export default connect(mapStateToProps)(Donate)
