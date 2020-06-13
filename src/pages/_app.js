import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '@/components/Layout/'
import keys from '@/keys'
import GlobalState from '@/context/GlobalState'
import { initGA, logPageView } from '@/utilities/analytics'
import postsContext from '@/context/postsContext'
import keysContext from '@/context/keysContext'
import settingsContext from '@/context/settingsContext'
import sectionOptionsContext from '@/context/sectionOptionsContext'
import pagesContext from '@/context/postsContext'
import '../sass/main.scss'


const App = (props) => {

  const { asPath } = useRouter()
  let {
    Component,
    pages,
    posts,
    keys,
    settings,
    sectionOptions,
    ...pageProps
  } = props
  const [gaInitialized, setGaInitialized] = useState(false)

  useEffect(() => {
    if (!gaInitialized) {
      setGaInitialized(true)
      initGA(keys.googleAnalyticsId)
    }
    if (gaInitialized) {
      logPageView()
    }
  }, [asPath])

  posts = posts || useContext(postsContext).posts
  pages = pages || useContext(pagesContext).pages
  keys = keys || useContext(keysContext).keys
  settings = settings || useContext(settingsContext).settings
  sectionOptions = sectionOptions || useContext(sectionOptionsContext)

  return (
    <GlobalState
      pages={pages}
      posts={posts}
      keys={keys}
      settings={settings}
      sectionOptions={sectionOptions}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalState>
  )
}


App.getInitialProps = async ({ Component, ctx }) => {

  let pageProps = {}
  const rootUrl = keys.rootURL ? keys.rootURL : ''

  // Run getInitialProps for each component
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  if (!!ctx.res) {
    
    const { data: publicKeys } = await axios.get(`${rootUrl}/api/utility/publicKeys`)
    pageProps.keys = publicKeys
  
    const { data: settings } = await axios.get(`${rootUrl}/api/utility/settings`)
    pageProps.settings = settings

    const { data: sectionOptions } = await axios.get(`${rootUrl}/api/pages/sectionOptions`)
    pageProps.sectionOptions = sectionOptions
  
    const { data: posts } = await axios.get(`${rootUrl}/api/posts/published`)
    pageProps.posts = posts
  
    const { data: pages } = await axios.get(`${rootUrl}/api/pages`)
    pageProps.pages = pages
  }


  return pageProps
}


export default App
