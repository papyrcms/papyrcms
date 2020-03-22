import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import axios from 'axios'
import Layout from '../components/Layout/'
import keys from '../config/keys'
import GlobalState from '../context/GlobalState'
import { initGA, logPageView } from '../utilities/analytics'
import '../sass/main.scss'


const App = (props: AppProps) => {

  const { pathname } = useRouter()
  const { Component, pageProps } = props
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      initGA()
    }
    if (initialized) {
      logPageView()
    }
  }, [pathname])

  return (
    <GlobalState {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalState>
  )
}


App.getInitialProps = async ({ Component, ctx }: any) => {

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


export default App
