import React from 'react'
import App, { Container } from 'next/app'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import axios from 'axios'
import Layout from '../components/Layout/'
import keys from '../config/keys'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'
import {
  setCurrentUser,
  setPages,
  setPage,
  setPosts,
  setPost,
  setBlogs,
  setBlog,
  setEvents,
  setEvent,
  setProducts,
  setProduct,
  setUsers,
  setMessages,
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

    // Get posts for page layout
    if (pageProps.posts) {
      dispatch(setPosts(pageProps.posts))
    } else {
      const rootUrl = keys.rootURL ? keys.rootURL : ''
      const response = await axios.get(`${rootUrl}/api/published_posts`)
      dispatch(setPosts(response.data))
    }

    // If pages were recieved, send it to the redux store
    if (!!pageProps.pages) {
      dispatch(setPages(pageProps.pages))
    }

    // If a page was recieved, send it to the redux store
    if (!!pageProps.page) {
      dispatch(setPage(pageProps.page))
    }

    // If a google maps key was recieved, send it to the redux store
    if (!!pageProps.googleMapsKey) {
      dispatch(setGoogleMapsKey(pageProps.googleMapsKey))
    }

    // If a post was recieved, send it to the redux store
    if (!!pageProps.post) {
      dispatch(setPost(pageProps.post))
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

    // If an product was recieved, send it to the redux store
    if (!!pageProps.product) {
      dispatch(setProduct(pageProps.product))
    }

    // If an array of products were recieved, send them to the redux store
    if (!!pageProps.products) {
      dispatch(setProducts(pageProps.products))
    }

    // If an array of users was recieved, send them to the redux store
    if (!!pageProps.users) {
      dispatch(setUsers(pageProps.users))
    }

    // If an array of messages was recieved, send them to the redux store
    if (!!pageProps.messages) {
      dispatch(setMessages(pageProps.messages))
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
