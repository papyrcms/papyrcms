import React from 'react'
import PostsForm from '../../components/PostsForm/'

export default () => (
  <PostsForm
    pageTitle="New Blog Post"
    apiEndpoint="/api/blogs"
    redirectRoute="/blog/all"
  />
)
