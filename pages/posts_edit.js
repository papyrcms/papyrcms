import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Router from 'next/router'
import PostsForm from '../components/PostsForm'
import keys from '../config/keys'

class PostsEdit extends Component {

  static async getInitialProps( context ) {

    const { id } = context.query
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const post = await axios.get( `${rootUrl}/api/posts/${id}` )

    return { post: post.data }
  }

  constructor( props ) {

    super( props )

    // Turn tags array into a string
    let tags = ''
    _.map( props.post.tags, ( tag, i ) => {
      if ( i < props.post.tags.length - 1 ) {
        tags = `${tags}${tag}, `
      } else {
        tags = `${tags}${tag}`
      }
    })

    this.state = { 
      title: props.post.title, 
      tags: tags, 
      mainMedia: props.post.mainMedia || '', 
      content: props.post.content,
      publish: props.post.published
    }
  }
  

  handleSubmit( event ) {

    event.preventDefault()

    const { title, tags, mainMedia, content, publish } = this.state
    let tagArray = []

    // Turn tags string into an array
    _.map( tags.split( ',' ), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if ( !!pendingTag ) {
        tagArray.push( pendingTag )
      }
    })

    const postObject = { title, tags: tagArray, mainMedia, content, published: publish }

    axios.put( `/api/posts/${this.props.post._id}`, postObject )
      .then( response => {
        Router.push( '/posts' )
      }).catch( error => {
        console.error( error )
      })
  }

  render() {
    const { title, tags, mainMedia, content, publish } = this.state

    return (
      <div className="posts-edit-page">
        <h2 className="heading-secondary">Edit Post</h2>
        <PostsForm
          isAdminUser={ this.props.currentUser.isAdmin }
          title={ title }
          onTitleChange={ event => this.setState({ title: event.target.value }) }
          tags={ tags }
          onTagsChange={ event => this.setState({ tags: event.target.value }) }
          mainMedia={ mainMedia }
          onMainMediaChange={ event => this.setState({ mainMedia: event.target.value }) }
          content={ content }
          onContentChange={ newContent => this.setState({ content: newContent }) }
          publish={ publish }
          onPublishChange={ () => this.setState({ publish: !publish }) }
          handleSubmit={ event => this.handleSubmit( event ) }
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { post: state.post, currentUser: state.currentUser }
}


export default connect( mapStateToProps )( PostsEdit )
