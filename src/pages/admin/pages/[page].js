import React from 'react'
import PageBuilder from '../page-builder'


const Page = () => <PageBuilder />


Page.getInitialProps = async context => {
  await PageBuilder.getInitialProps(context)
}


export default Page
