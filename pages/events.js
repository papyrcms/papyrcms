import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import keys from '../config/keys'
import PostsFilter from '../components/PostsFilter'
import { SectionStandard } from '../components/Sections/'

class EventsPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const events = await axios.get(`${rootUrl}/api/published_events`)

    return { events: events.data }
  }


  render() {

    return (
      <div className="events-page">
        <PostsFilter
          posts={this.props.events}
          settings={{
            maxPosts: 9999
          }}
          component={SectionStandard}
          componentProps={{
            title: 'Events',
            mediaLeft: true,
            readMore: true,
            path: 'events',
            emptyMessage: 'There are no events coming up.',
            showDate: 'date'
          }}
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { events: state.events }
}


export default connect(mapStateToProps)(EventsPage)
