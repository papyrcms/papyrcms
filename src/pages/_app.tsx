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
  setStripePubKey,
  setGoogleMapsKey
} from '../reduxStore'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }): Promise<any> {

    const { reduxStore } = ctx
    const { dispatch } = reduxStore
    let pageProps: any = {}
    const rootUrl = keys.rootURL ? keys.rootURL : ''

    // Run getInitialProps for each component
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // If a google maps key was recieved, send it to the redux store
    if (!!pageProps.googleMapsKey) {
      dispatch(setGoogleMapsKey(pageProps.googleMapsKey))
    }

    // If a stripe publishable key was receieved, send it to the redux store
    if (!!pageProps.stripePubKey) {
      dispatch(setStripePubKey(pageProps.stripePubKey))
    }

    const { data: settings } = await axios.get(`${rootUrl}/api/utility/settings`)
    pageProps.settings = settings

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

    const { Component, reduxStore, posts, pages, settings, ...pageProps } = this.props as any

    return (
      <GlobalState posts={posts} pages={pages} settings={settings}>
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
