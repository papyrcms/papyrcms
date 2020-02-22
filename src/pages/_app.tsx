import React from 'react'
import App from 'next/app'
import axios from 'axios'
import Layout from '../components/Layout/'
import keys from '../config/keys'
import GlobalState from '../context/GlobalState'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'


class MyApp extends App {

  static async getInitialProps({ Component, ctx }): Promise<any> {

    let pageProps: any = {}
    const rootUrl = keys.rootURL ? keys.rootURL : ''

    // Run getInitialProps for each component
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const { data: googleMapsKey } = await axios.post(`${rootUrl}/api/utility/googleMapsKey`)
    const { data: stripePubKey } = await axios.post(`${rootUrl}/api/utility/stripePubKey`)
    pageProps.keys = { googleMapsKey, stripePubKey }

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

    const { Component, posts, pages, settings, keys, ...pageProps } = this.props as any

    return (
      <GlobalState posts={posts} pages={pages} settings={settings} keys={keys}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalState>
    )
  }
}

export default MyApp
