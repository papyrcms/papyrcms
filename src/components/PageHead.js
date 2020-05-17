import React, { Fragment } from 'react'
import Head from 'next/head'


const PageHead = (props) => {

  const {
    title, titleContent, image,
    description, keywords, children
  } = props

  const titleTags = () => {
    if (title) {
      return (
        <Fragment>
          <title>{title}{titleContent}</title>
          <meta key="title" name="title" content={`${title}${titleContent}`} />
          <meta key="og-title" property="og:title" content={`${title}${titleContent}`} />
          <meta key="og-site-name" property="og:site_name" content={title} />
          <meta key="twitter-title" property="twitter:title" content={title} />
        </Fragment>
      )
    }
  }


  const descriptionTags = () => {
    if (description) {
      return (
        <Fragment>
          <meta key="twitter-description" property="twitter:description" content={description} />
          <meta key="description" name="description" content={description} />
          <meta key="og-description" property="og:description" content={description} />
        </Fragment>
      )
    }
  }


  const imageTags = () => {
    if (image) {
      return (
        <Fragment>
          <meta key="og-image" property="og:image" content={image} />
          <meta key="og-url" property="og:url" content={image} />
          <meta key="og-image-type" property="og:image:type" content="image/jpeg" />
          <meta key="og-image-width" property="og:image:width" content="200" />
          <meta key="og-image-height" property="og:image:height" content="200" />
        </Fragment>
      )
    }
  }


  const keywordsTags = () => {
    if (keywords) {
      return (
        <Fragment>
          <meta key="keywords" name="keywords" content={keywords} />
        </Fragment>
      )
    }
  }

  return (
    <Head>
      {titleTags()}

      {descriptionTags()}

      {imageTags()}

      {keywordsTags()}

      {children}
    </Head>
  )
}


export default PageHead
