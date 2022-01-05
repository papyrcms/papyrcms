import {
  Page,
  Post,
  Blog,
  Event,
  Product,
  SectionOptions,
  Keys,
} from '@/types'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import '@fortawesome/fontawesome-free/js/all.min'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Layout } from '@/components'
import keys from '@/keys'
import { GlobalState } from '@/context'
import { initGA, logPageView } from '@/utilities/analytics'
import '../sass/main.scss'
import 'swagger-ui-react/swagger-ui.css'

type Props = {
  Component: any
  pages: Page[]
  posts: Post[]
  blogs: Blog[]
  events: Event[]
  products: Product[]
  keys: Keys
  settings: any
  sectionOptions: SectionOptions
}

const PapyrCms = (props: Props) => {
  const { asPath, push } = useRouter()
  const anchorsRef = useRef<
    [HTMLAnchorElement, EventListenerOrEventListenerObject][]
  >([])
  useEffect(() => {
    const anchors = document.querySelectorAll('a')
    for (const anchor of anchors) {
      if (anchor.classList.contains('papyr-link')) {
        const handleClick = (event: any) => {
          event.preventDefault()
          push(event.target.href)
        }
        anchor.addEventListener('click', handleClick)
        anchorsRef.current.push([anchor, handleClick])
      }
    }

    return () => {
      anchorsRef.current.forEach(([anchor, callback]) => {
        anchor.removeEventListener('click', callback)
      })
    }
  }, [asPath])
  let {
    Component,
    pages = [],
    posts = [],
    blogs = [],
    events = [],
    products = [],
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
    FontAwesome.config.autoAddCss = false
  }, [asPath])

  return (
    <GlobalState
      pages={pages}
      posts={posts}
      blogs={blogs}
      events={events}
      products={products}
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

PapyrCms.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: any
  ctx: any
}) => {
  let pageProps: any = {}
  const rootUrl = keys.rootURL ? keys.rootURL : ''

  // Run getInitialProps for each component
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  if (!!ctx.res) {
    const { data } = await axios.get(`${rootUrl}/api/_app`)
    pageProps = {
      ...pageProps,
      ...data,
    }
  }

  return pageProps
}

export default PapyrCms
