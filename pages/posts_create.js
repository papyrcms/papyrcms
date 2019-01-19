import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { connect } from 'react-redux'
import Router from 'next/router'
import PostsForm from '../components/PostsForm'

class PostsCreate extends Component {

  constructor( props ) {

    super( props )

    this.state = { title: '', tags: '', mainMedia: '', content: '', publish: false }
  }


  handleSubmit( event ) {

    event.preventDefault()

    const { title, tags, mainMedia, content, publish } = this.state
    let tagArray = []

    _.map( tags.split( ',' ), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if ( !!pendingTag ) {
        tagArray.push( pendingTag )
      }
    })

    const postObject = { title, tags: tagArray, mainMedia, content, published: publish }

    axios.post( '/api/posts', postObject )
      .then( response => {
        Router.push( '/posts' )
      }).catch( error => {
        console.log( error )
      })
  }

  render() {

    const { title, tags, mainMedia, content, publish } = this.state

    return (
      <div className="posts-create-page">
        <h2 className="heading-secondary">New Post</h2>
        <PostsForm 
          isAdminUser={ this.props.currentUser.isAdmin }
          title={ title } 
          onTitleChange={ event => this.setState({ title: event.target.value }) }
          tags={ tags }
          onTagsChange={ event => this.setState({ tags: event.target.value }) }
          mainMedia={ mainMedia }
          onmainMediaChange={ event => this.setState({ mainMedia: event.target.value }) }
          content={ content }
          onContentChange={ newContent => this.setState({ content: newContent }) }
          publish={ publish }
          onPublishChange={ () => this.setState({ publish: !publish }) }
          handleSubmit={ event => this.handleSubmit(event) }
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect( mapStateToProps )( PostsCreate )
