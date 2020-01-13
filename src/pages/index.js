import Page from './[page]'


const Home = props => <Page />


Home.getInitialProps = async context => {
  return await Page.getInitialProps(context)
}


export default Home
