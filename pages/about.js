import React from 'react'
import PostShow from '../components/PostShow'
import filterPosts from '../components/filterPosts'


const AboutPage = props => (
  <PostShow
    className="about-page"
    emptyTitle="About Page"
    emptyMessage="Create content with the 'about' tag."
    path="posts"
    apiPath="/api/posts"
    redirectRoute="/about"
    post={props.posts[0]}
  />
)


const settings = {
  maxPosts: 1,
  postTags: 'about',
}


export default filterPosts(AboutPage, settings)
