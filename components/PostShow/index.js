import React, { Component } from 'react'
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


  render() {

    const { post, settings, enableCommenting, currentUser, apiPath } = this.props
    const { title, tags, mainMedia, content } = post

    return (
      <div className={`posts-show-page`}>
        <div className="post">
          <h2 className="heading-secondary post__title u-margin-bottom-small">{title}</h2>
          {this.renderTagsSection(tags)}
          {this.renderMainMedia(mainMedia)}
          <div className="post__content">{renderHTML(content)}</div>
          {this.renderAuthOptions()}
        </div>
        
        <Comment 
          post={post}
          comments={post.comments}
          currentUser={currentUser}
          settings={settings} 
          enableCommenting={enableCommenting}
          apiPath={apiPath}
        /> 
      </div>
    )
  }
}

export default PostShow
