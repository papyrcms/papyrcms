import React from 'react'
import axios from 'axios'
import moment from 'moment'
import keys from '../../config/keys'
import { SectionStrip } from '../../components/Sections/'

type Props = {
  events: Array<event>
}

const EventsPage = ({ events }: Props) => {


  const renderDate = (event: event) => (
    <p>{moment(event.date).format('MMMM Do, YYYY')}</p>
  )


  return <SectionStrip
    posts={events}
    title="Events"
    mediaLeft
    readMore
    path="events"
    emptyMessage="There are no events coming up."
    beforePostContent={renderDate}
  />
}


EventsPage.getInitialProps = async () => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: events } = await axios.get(`${rootUrl}/api/events/published`)

  return { events }
}


export default EventsPage
