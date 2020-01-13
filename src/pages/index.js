import Page from './[page]'


const Home = () => <Page />


Home.getInitialProps = async context => {
  return await Page.getInitialProps(context)
}


export default Home
