import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment-timezone'
import Link from 'next/link'
import Router from 'next/router'
import Head from 'next/head'
import renderHTML from 'react-render-html'
import Comment from './Comment'
import Media from '../Media'


/**
 * PostShow is the main component to show the details of a particular post
 * 
 * @prop post - Object - The post that will be displayed on the page
 * @prop enableCommenting - Boolean - Whether or not users can comment on this post
 * @prop path - String - The prefix for accessing the edit page
 * @prop apiPath - String - The api prefix for CRUD operations
 * @prop redirectRoute - String - The route to redirect to after deleting the post
 * @prop showDate - Boolean - If true, the publish or created date will show
 * @prop className - String - Any additional classes to wrap the component
 */
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

    if (!!currentUser && (currentUser.isAdmin || currentUser._id === post.author._id)) {
      return (
        <div className="post__buttons">
          <button className="button button-delete" onClick={() => this.onDeleteClick()}>Delete</button>
          <Link href={`/${path}_edit?id=${post._id}`} as={`/${path}/${post._id}/edit`}>
            <button className="button button-edit">Edit</button>
          </Link>
        </div>
      )
    }
  }


  renderTags(tags) {

    return tags.map((tag, i) => {
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


  renderMainMedia(media, alt) {

    if (!!media) {
      return <div className="post__image"><Media src={media} alt={alt} /></div>
    }
  }


  renderPublishSection(published) {

    if (!published) {
      return <p><em>Not published</em></p>
    }

    return null
  }


  renderDate() {

    const { showDate, post } = this.props

    if (showDate) {

      const date = post.published && post.publishDate
        ? post.publishDate
        : post.created

      return <p>{moment(date).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
    }

    return null
  }


  render() {

    if (this.props.post) {

      const { post, enableCommenting, apiPath, className } = this.props
      const { title, tags, mainMedia, content, published } = post

      let postContent = content || ''

      return (
        <div className={`posts-show-page ${className || ''}`}>

          <Head>
            <title>{`Derek Garnett | ${title || ''}`}</title>
            <meta key="og-image" property="og:image" content={mainMedia || ''} />
            <meta key="og-url" property="og:url" content={mainMedia || ''} />
            <meta key="title" name="title" content={title || ''} />
            <meta key="twitter-title" property="twitter:title" content={title || ''} />
            <meta key="twitter-description" property="twitter:description" content={postContent.replace('<p>', '').replace('</p>', '')} />
            <meta key="og-title" property="og:title" content={title || ''} />
            <meta key="keywords" name="keywords" content={tags || ''} />
            <meta key="description" name="description" content={postContent.replace('<p>', '').replace('</p>', '')} />
            <meta key="og-description" property="og:description" content={postContent.replace('<p>', '').replace('</p>', '')} />
          </Head>

          <div className="posts-show-page__container">

            <div className="post">
              {this.renderPublishSection(published)}
              <h2 className="heading-secondary post__title u-margin-bottom-small">{title}</h2>
              {this.renderDate()}
              {this.renderTagsSection(tags)}
              {this.renderMainMedia(mainMedia, title)}
              <div className="post__content">{renderHTML(postContent)}</div>
              {this.renderAuthOptions()}
            </div>

            <Comment
              post={post}
              comments={post.comments}
              enableCommenting={enableCommenting}
              apiPath={apiPath}
            />
          </div>
        </div>
      )
    } else {
      
      const { className, emptyTitle, emptyMessage } = this.props

      return (
        <div className={`posts-show-page ${className || ''}`}>
          <div className="posts-show-page__container">
          <h2 className="heading-secondary">{emptyTitle}</h2>
            <h3 className="heading-tertiary">{emptyMessage}</h3>
          </div>
        </div>
      )
    }
  }
}


const mapStateToProps = state => {

  const { currentUser, settings } = state

  return { currentUser, settings }
}


export default connect(mapStateToProps)(PostShow)
