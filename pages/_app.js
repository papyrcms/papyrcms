import React from 'react'
import App, { Container } from 'next/app'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import { setCurrentUser, setPosts, setPost, setUsers, setSettings } from '../store'
import Layout from '../components/Layout'
import '../sass/main.scss'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    
    const { reduxStore, req, res } = ctx
    const isServer = !!req
    let pageProps = {}

    // Run getInitialProps for each component
    if ( Component.getInitialProps ) {
      pageProps = await Component.getInitialProps( ctx )
    }

    // If a post was recieved, send it to the redux store
    if ( !!pageProps.post ) {
      reduxStore.dispatch( setPost( pageProps.post ))
    }

    // If an array of posts were recieved, send them to the redux store
    if ( !!pageProps.posts ) {
      reduxStore.dispatch( setPosts( pageProps.posts ))
    }

    // If an array of users was recieved, send them to the redux store
    if ( !!pageProps.users ) {
      reduxStore.dispatch( setUsers( pageProps.users ))
    }

    // Set Current User and Website Settings in the redux store
    if ( isServer ) {
      reduxStore.dispatch( setSettings( res.locals.settings ))
      reduxStore.dispatch( setCurrentUser( res.locals.currentUser ))
    }

    // Return nothing. Props are set by the redux store
    return {}
  }


  render() {
    const { Component, reduxStore } = this.props

    return (
      <Container>
        <Provider store={ reduxStore }>
          <Layout>
            <Component />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore( MyApp )
