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

    // If a google maps key was recieved, send it to the redux store
    if (!!pageProps.googleMapsKey) {
      dispatch(setGoogleMapsKey(pageProps.googleMapsKey))
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

    const { data: posts } = await axios.get(`${rootUrl}/api/posts/published`)
    pageProps.posts = posts

    const { data: pages } = await axios.get(`${rootUrl}/api/pages`)
    pageProps.pages = pages

    return pageProps
  }


  componentDidMount() {
    initGA()
  }


  componentDidUpdate() {
    logPageView()
  }


  render() {

    const { Component, reduxStore, posts, pages, ...pageProps } = this.props as any

    return (
      <GlobalState posts={posts} pages={pages}>
        <Provider store={reduxStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </GlobalState>
    )
  }
}

export default withReduxStore(MyApp)
