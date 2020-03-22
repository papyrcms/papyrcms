import { NextPageContext } from 'next'
import Page from './[page]'


const Home = (props: any) => <Page {...props} />


Home.getInitialProps = async (context: NextPageContext) => {
  return await Page.getInitialProps(context)
}


export default Home
