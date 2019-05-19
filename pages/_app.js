import React from 'react'
import App, { Container } from 'next/app'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import { setCurrentUser, setPosts, setPost, setBlogs, setBlog, setUsers, setSettings, setStripePubKey, setRoute, setGoogleMapsKey } from '../store'
import Layout from '../components/Layout'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {

    const { reduxStore, req, res, pathname } = ctx
    const isServer = !!req
    let pageProps = {}

    // Pass the route to the redux store
    reduxStore.dispatch(setRoute(pathname))

    // Run getInitialProps for each component
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // If a google maps key was recieved, send it to the redux store
    if (!!pageProps.googleMapsKey) {
      reduxStore.dispatch(setGoogleMapsKey(pageProps.googleMapsKey))
    }

    // If a post was recieved, send it to the redux store
    if (!!pageProps.post) {
      reduxStore.dispatch(setPost(pageProps.post))
    }

    // If an array of posts were recieved, send them to the redux store
    if (!!pageProps.posts) {
      reduxStore.dispatch(setPosts(pageProps.posts))
    }

    // If a blog was recieved, send it to the redux store
    if (!!pageProps.blog) {
      reduxStore.dispatch(setBlog(pageProps.blog))
    }

    // If an array of blogs were recieved, send them to the redux store
    if (!!pageProps.blogs) {
      reduxStore.dispatch(setBlogs(pageProps.blogs))
    }

    // If an array of users was recieved, send them to the redux store
    if (!!pageProps.users) {
      reduxStore.dispatch(setUsers(pageProps.users))
    }

    // If a stripe publishable key was receieved, send it to the redux store
    if (!!pageProps.stripePubKey) {
      reduxStore.dispatch(setStripePubKey(pageProps.stripePubKey))
    }

    // Set Current User and Website Settings in the redux store
    if (isServer) {
      reduxStore.dispatch(setSettings(res.locals.settings))
      reduxStore.dispatch(setCurrentUser(res.locals.currentUser))
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
