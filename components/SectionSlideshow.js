import React, { Component } from 'react'
import _ from 'lodash'
import SectionMedia from './SectionMedia'

class SectionSlideshow extends Component {

  constructor( props ) {

    super( props )

    this.state = { counter: 0, selected: null }
  }


  componentDidMount() {

    setInterval( this.incrimentCounter.bind(this), this.props.timer || 5000 )
  }


  incrimentCounter() {

    const { counter, selected } = this.state

    if ( selected === null ) {
      if ( counter === this.props.posts.length-1 ) {
        this.setState({ counter: 0 })
      } else {
        this.setState({ counter: counter+1 })
      }
    }
  }


  renderSlides() {

    return _.map( this.props.posts, ( post, i ) => {
      return (
        <SectionMedia
          key={post._id}
          posts={[post]}
          className={`${this.state.counter !== i ? 'slide--hidden' : ''} slide`}
        />
      )
    })
  }


  renderButtons() {

    return _.map(this.props.posts, ( post, i ) => {
      return (
        <input
          onClick={() => this.setState({ selected: i, counter: i }) }
          className="section-slideshow__button"
          type="radio"
          checked={this.state.counter === i ? true : false}
        />
      )
    })
  }


  render() {

    return (
      <div className="section-slideshow">
        { this.renderSlides() }
        <div className="section-slideshow__buttons">
          {this.renderButtons()}
        </div>
      </div>
    )
  }
}

export default SectionSlideshow
