import React from 'react'
import { NextPageContext } from 'next'
import PageBuilder from '../page-builder'


const Page = (props: any) => <PageBuilder {...props} />


Page.getInitialProps = async (context: NextPageContext) => {
  return await PageBuilder.getInitialProps(context)
}


export default Page
