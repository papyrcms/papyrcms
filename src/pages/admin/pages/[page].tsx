import React from 'react'
import PageBuilder from '../page-builder'


const Page = (props: any) => <PageBuilder {...props} />


Page.getInitialProps = async (context: any) => {
  return await PageBuilder.getInitialProps(context)
}


export default Page
