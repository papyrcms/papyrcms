import { Event } from '@/types'
import { useState } from 'react'
import { eventsContext } from './eventsContext'

interface Props {
  events: Event[]
  children: any
}

const EventsProvider = (props: Props) => {
  const [events, setEvents] = useState(props.events)

  return (
    <eventsContext.Provider
      value={{
        events,
        setEvents,
      }}
    >
      {props.children}
    </eventsContext.Provider>
  )
}

export default EventsProvider
