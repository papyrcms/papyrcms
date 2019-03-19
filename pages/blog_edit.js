import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Router from 'next/router'
import PostsForm from '../components/PostsForm'
import keys from '../config/keys'

class BlogEdit extends Component {

  static async getInitialProps({ query, req }) {

    let axiosConfig

    // Depending on if we are doing a client or server render
    if (!!req) {
      axiosConfig = {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie
        }
      }
    }

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const blog = await axios.get(`${rootUrl}/api/blogs/${query.id}`, axiosConfig)

    return { blog: blog.data }
  }

  constructor(props) {

    super(props)

    // Turn tags array into a string
    let tags = ''
    _.map(props.blog.tags, (tag, i) => {
      if (i < props.blog.tags.length - 1) {
        tags = `${tags}${tag}, `
      } else {
        tags = `${tags}${tag}`
      }
    })

    const { title, mainMedia, content, published } = props.blog

    this.state = {
      title,
      tags,
      mainMedia: mainMedia || '',
      content,
      publish: published
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { title, tags, mainMedia, content, publish } = this.state
    let tagArray = []

    // Turn tags string into an array
    _.map(tags.split(','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) {
        tagArray.push(pendingTag)
      }
    })

    const blogObject = { title, tags: tagArray, mainMedia, content, published: publish }

    axios.put(`/api/blogs/${this.props.blog._id}`, blogObject)
      .then(response => {
        Router.push('/blog/all')
      }).catch(error => {
        console.error(error)
      })
  }

  render() {
    const { title, tags, mainMedia, content, publish } = this.state

    return (
      <div className="posts-edit-page">
        <h2 className="heading-secondary">Edit Blog Post</h2>
        <PostsForm
          isAdminUser={this.props.currentUser.isAdmin}
          title={title}
          onTitleChange={event => this.setState({ title: event.target.value })}
          tags={tags}
          onTagsChange={event => this.setState({ tags: event.target.value })}
          mainMedia={mainMedia}
          onMainMediaChange={event => this.setState({ mainMedia: event.target.value })}
          content={content}
          onContentChange={newContent => this.setState({ content: newContent })}
          publish={publish}
          onPublishChange={() => this.setState({ publish: !publish })}
          handleSubmit={event => this.handleSubmit(event)}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { blog: state.blog, currentUser: state.currentUser }
}


export default connect(mapStateToProps)(BlogEdit)
