import React from 'react'
import App, { Container } from 'next/app'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import Layout from '../components/Layout/'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'
import { 
  setCurrentUser, 
  setPosts, 
  setPost, 
  setBlogs, 
  setBlog, 
  setEvents,
  setEvent,
  setUsers, 
  setSettings, 
  setStripePubKey, 
  setRoute,
  setUrl,
  setGoogleMapsKey 
} from '../reduxStore'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {

    const { reduxStore, req, res, pathname } = ctx
    const isServer = !!req
    let pageProps = {}

    const { dispatch } = reduxStore

    // Pass the route to the redux store
    dispatch(setRoute(pathname))

    // Run getInitialProps for each component
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // If a google maps key was recieved, send it to the redux store
    if (!!pageProps.googleMapsKey) {
      dispatch(setGoogleMapsKey(pageProps.googleMapsKey))
    }

    // If a post was recieved, send it to the redux store
    if (!!pageProps.post) {
      dispatch(setPost(pageProps.post))
    }

    // If an array of posts were recieved, send them to the redux store
    if (!!pageProps.posts) {
      dispatch(setPosts(pageProps.posts))
    }

    // If a blog was recieved, send it to the redux store
    if (!!pageProps.blog) {
      dispatch(setBlog(pageProps.blog))
    }

    // If an array of blogs were recieved, send them to the redux store
    if (!!pageProps.blogs) {
      dispatch(setBlogs(pageProps.blogs))
    }

    // If an event was recieved, send it to the redux store
    if (!!pageProps.event) {
      dispatch(setEvent(pageProps.event))
    }

    // If an array of events were recieved, send them to the redux store
    if (!!pageProps.events) {
      dispatch(setEvents(pageProps.events))
    }

    // If an array of users was recieved, send them to the redux store
    if (!!pageProps.users) {
      dispatch(setUsers(pageProps.users))
    }

    // If a stripe publishable key was receieved, send it to the redux store
    if (!!pageProps.stripePubKey) {
      dispatch(setStripePubKey(pageProps.stripePubKey))
    }

    // Set Current User and Website Settings in the redux store
    if (isServer) {
      dispatch(setSettings(res.locals.settings))
      dispatch(setCurrentUser(req.user))
      dispatch(setUrl({ query: req.query }))
    }

    // Return nothing. Props are set by the redux store
    return {}
  }


  componentDidMount() {

    initGA()
  }


  componentDidUpdate() {

    logPageView()
  }


  render() {

    const { Component, reduxStore } = this.props

    return (
      <Container>
        <Provider store={reduxStore}>
          <Layout>
            <Component />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
