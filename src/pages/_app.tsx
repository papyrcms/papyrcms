import React from 'react'
import App from 'next/app'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import axios from 'axios'
import Layout from '../components/Layout/'
import keys from '../config/keys'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'
import GlobalState from '../context/GlobalState'
import {
  setPages,
  setPage,
  setPosts,
  setPost,
  setBlogs,
  setBlog,
  setEvents,
  setEvent,
  setOrders,
  setUsers,
  setMessages,
  setSettings,
  setStripePubKey,
  setRoute,
  setUrl,
  setGoogleMapsKey
} from '../reduxStore'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }): Promise<any> {

    const { reduxStore, req, pathname } = ctx
    const { dispatch } = reduxStore
    const isServer = !!req
    let pageProps: any = {}
    const rootUrl = keys.rootURL ? keys.rootURL : ''

    // Pass the route to the redux store
    dispatch(setRoute(pathname))

    // Run getInitialProps for each component
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Get posts for page layout
    if (!!pageProps.posts) {
      dispatch(setPosts(pageProps.posts))
    } else {
      const { data: posts } = await axios.get(`${rootUrl}/api/posts/published`)
      dispatch(setPosts(posts))
    }

    // Get pages for navmenu
    if (!!pageProps.pages) {
      dispatch(setPages(pageProps.pages))
    } else {
      const { data: pages } = await axios.get(`${rootUrl}/api/pages`)
      dispatch(setPages(pages))
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

    // If an array of orders were recieved, send them to the redux store
    if (!!pageProps.orders) {
      dispatch(setOrders(pageProps.orders))
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
      const { data: settings } = await axios.get(`${rootUrl}/api/utility/settings`)
      dispatch(setSettings(settings))
      dispatch(setUrl({ query: req.query }))
    }

    return pageProps
  }


  async componentDidMount() {
    initGA()
  }


  componentDidUpdate() {
    logPageView()
  }


  render() {

    const { Component, reduxStore } = this.props as any

    return (
      <GlobalState>
        <Provider store={reduxStore}>
          <Layout>
            <Component {...this.props} />
          </Layout>
        </Provider>
      </GlobalState>
    )
  }
}

export default withReduxStore(MyApp)
