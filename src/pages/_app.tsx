import {
  Page,
  Post,
  Blog,
  Event,
  Product,
  SectionOptions,
  Keys,
} from '@/types'
import axios from 'axios'
import { Layout } from '@/components'
import keys from '@/keys'
import { GlobalState } from '@/context'
import { useGa, useNextAnchors } from '@/hooks'
import 'swagger-ui-react/swagger-ui.css'
import '@fortawesome/fontawesome-free/js/all.min'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../sass/main.scss'

interface Props {
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
  useNextAnchors()
  useGa()

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
