import Page from './[page]'


const Home = (props: any) => <Page {...props} />


Home.getInitialProps = async (context: any) => {
  return await Page.getInitialProps(context)
}


export default Home
