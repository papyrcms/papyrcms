/**
 * PostShow is the main component to show the details of a particular post
 * 
 * props include:
 *   post: Object - The post that will be displayed on the page
 *   enableCommenting: Boolean - Whether or not users can comment on this post
 *   path: String - The prefix for accessing the edit page
 *   apiPath: String - The api prefix for CRUD operations
 *   redirectRoute: String - The route to redirect to after deleting the post
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import Link from 'next/link'
import Router from 'next/router'
import renderHTML from 'react-render-html'
import Comment from './Comment'
import Media from '../Media'

class PostShow extends Component {

  onDeleteClick() {

    const confirm = window.confirm('Are you sure you want to delete this post?')

    if (confirm) {

      let { apiPath, redirectRoute } = this.props
      apiPath = apiPath ? apiPath : '/api/posts'
      redirectRoute = redirectRoute ? redirectRoute : '/posts'

      axios.delete(`${apiPath}/${this.props.post._id}`)
        .then(res => {
          Router.push(redirectRoute)
        }).catch(error => {
          console.error(error)
        })
    }
  }


  renderAuthOptions() {

    const { post, currentUser, path } = this.props

    if (!!currentUser && (currentUser._id === post.author._id || currentUser.isAdmin)) {
      return (
        <div className="post__buttons">
          <button className="button button-secondary" onClick={() => this.onDeleteClick()}>Delete</button>
          <Link href={`/${path}_edit?id=${post._id}`} as={`/${path}/${post._id}/edit`}>
            <button className="button button-tertiary">Edit</button>
          </Link>
        </div>
      )
    }
  }


  renderTags(tags) {

    return _.map(tags, (tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }


  renderTagsSection(tags) {

    const { currentUser } = this.props

    if (!!tags[0] && !!currentUser && currentUser.isAdmin) {
      return <p className="post__tags">Tags: <em>{this.renderTags(tags)}</em></p>
    }
  }


  renderMainMedia(media) {

    if (!!media) {
      return <div className="post__image"><Media src={media} /></div>
    }
  }


  renderPublishSection(published) {
    
    if (!published) {
      return <p><em>Not published</em></p>
    }

    return null
  }


  render() {

    const { post, enableCommenting, apiPath } = this.props
    const { title, tags, mainMedia, content, published } = post

    return (
      <div className={`posts-show-page`}>
        <div className="post">
          {this.renderPublishSection(published)}
          <h2 className="heading-secondary post__title u-margin-bottom-small">{title}</h2>
          {this.renderTagsSection(tags)}
          {this.renderMainMedia(mainMedia)}
          <div className="post__content">{renderHTML(content)}</div>
          {this.renderAuthOptions()}
        </div>
        
        <Comment 
          post={post}
          comments={post.comments}
          enableCommenting={enableCommenting}
          apiPath={apiPath}
        /> 
      </div>
    )
  }
}


const mapStateToProps = state => {

  const { currentUser, settings } = state

  return { currentUser, settings }
}


export default connect(mapStateToProps)(PostShow)
