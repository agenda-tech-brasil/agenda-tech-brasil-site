import { Evento } from '@/@types/events'

export async function fetchEvents(init?: RequestInit): Promise<Evento[]> {
  const response = await fetch(
    'https://raw.githubusercontent.com/agenda-tech-brasil/agenda-tech-brasil/refs/heads/main/src/db/database.json',
    init,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }
  const data = await response.json()
  return data.eventos
}
