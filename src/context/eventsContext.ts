import { Event } from '@/types'
import { createContext, useContext } from 'react'

type EventContext = {
  events: Event[]
  setEvents: Function
}

export const eventsContext = createContext<EventContext>({
  events: [],
  setEvents: (events: Event[]) => {},
})

const useEvents = () => useContext(eventsContext)
export default useEvents
