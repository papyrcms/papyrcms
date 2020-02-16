import Page from './[page]'


const Home = props => <Page {...props} />


Home.getInitialProps = async context => {
  return await Page.getInitialProps(context)
}


export default Home
