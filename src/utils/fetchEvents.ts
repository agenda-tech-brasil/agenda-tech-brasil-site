import { Evento } from '@/@types/events'

export async function fetchEvents(): Promise<Evento[]> {
  const response = await fetch(
    'https://raw.githubusercontent.com/agenda-tech-brasil/agenda-tech-brasil/refs/heads/main/src/db/database.json',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }
  const data = await response.json()
  console.log("🚀 ~ fetchEvents ~ data:", data)
  return data.eventos
}
