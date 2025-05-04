// utils/FilterEvents.ts
import { Evento } from '@/@types/events'

export function applyEventFilters(
  events: Evento[],
  filters: {
    year?: string
    location?: string
    type?: string
    startDate?: string
    endDate?: string
  },
): Evento[] {
  const monthMapping: Record<string, number> = {
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
  }

  return events
    .filter((e) => (filters.year ? e.ano.toString() === filters.year : true))
    .map((year) => ({
      ...year,
      meses: year.meses
        .map((mes) => ({
          ...mes,
          eventos: mes.eventos.filter((ev) => {
            if (
              filters.location &&
              !ev.cidade?.toLowerCase().includes(filters.location.toLowerCase())
            )
              return false
            if (
              filters.type &&
              ev.tipo?.toLowerCase() !== filters.type.toLowerCase()
            )
              return false
            if (filters.startDate || filters.endDate) {
              const day = Number(ev.data[0])
              const date = new Date(
                year.ano,
                monthMapping[mes.mes.toLowerCase()] || 0,
                day,
              )
              if (filters.startDate && date < new Date(filters.startDate))
                return false
              if (filters.endDate && date > new Date(filters.endDate))
                return false
            }
            return true
          }),
        }))
        .filter((mes) => mes.eventos.length > 0),
    }))
    .filter((year) => year.meses.length > 0)
}
