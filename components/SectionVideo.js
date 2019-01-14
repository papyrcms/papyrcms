import React from 'react'
import renderHTML from 'react-render-html'

const SectionVideo = props => {
  return (
    <section className="section-video">

      <div className="section-video__text">
        <h2 className="section-video__title">{ props.posts[0].title }</h2>
        <div className="section-video__subtext">{ renderHTML( props.posts[0].content ) }</div>
      </div>
      
      <video className="section-video__video" autoPlay muted loop>
        <source src="static/videos/The-Hill.mp4" type="video/mp4" />
        <source src="static/videos/The-Hill.webm" type="video/webm" />
        Your browser is not supported.
      </video>

    </section>
  )
}

export default SectionVideo
