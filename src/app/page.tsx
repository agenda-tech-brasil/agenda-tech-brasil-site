import { Evento } from '@/@types/events'
import EventList from '@/components/EventList'
import { fetchEvents } from '@/utils/fetchEvents'

export default async function HomePage() {
  const events: Evento[] = await fetchEvents()

  return <EventList initialEvents={events} />
}
