import { Event } from '@/types'
import { createContext } from 'react'

type EventContext = {
  events: Event[]
  setEvents: Function
}

export default createContext<EventContext>({
  events: [],
  setEvents: (events: Event[]) => {},
})
