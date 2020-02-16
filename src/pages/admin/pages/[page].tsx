import React from 'react'
import PageBuilder from '../page-builder'


const Page = props => <PageBuilder {...props} />


Page.getInitialProps = async context => {
  return await PageBuilder.getInitialProps(context)
}


export default Page
