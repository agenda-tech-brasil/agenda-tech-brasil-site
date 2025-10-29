import { Evento } from '@/@types/events'
import { MONTH_MAP } from './constants'

/**
 * Extrai tipos únicos de eventos
 */
export function getUniqueEventTypes(eventsData: Evento[]): string[] {
  const types = new Set<string>()

  eventsData.forEach((yearData) => {
    yearData.meses.forEach((mes) => {
      mes.eventos.forEach((evento) => {
        if (evento.tipo) {
          types.add(evento.tipo.toLowerCase())
        }
      })
    })
  })

  return Array.from(types)
}

/**
 * Extrai anos únicos dos eventos
 */
export function getUniqueYears(events: Evento[]): string[] {
  return [...new Set(events.map((e) => e.ano.toString()))]
}

/**
 * Formata a localização do evento
 */
export function formatEventLocation(
  cidade: string,
  uf: string,
  tipo: string,
): string {
  if (cidade && uf) {
    return `${cidade}, ${uf}`
  }
  if (tipo === 'online') {
    return ''
  }
  return 'Sem informação de local'
}

/**
 * Aplica filtros aos eventos
 */
export function applyEventFilters(
  events: Evento[],
  filters: {
    year?: string
    location?: string
    type?: string
    startDate?: string
    endDate?: string
    month?: string
  },
): Evento[] {
  return events
    .filter((e) => (filters.year ? e.ano.toString() === filters.year : true))
    .map((year) => ({
      ...year,
      meses: year.meses
        .filter((mes) =>
          filters.month
            ? mes.mes.toLowerCase() === filters.month.toLowerCase()
            : true,
        )
        .map((mes) => ({
          ...mes,
          eventos: mes.eventos.filter((ev) => {
            // Filtro de localização
            if (
              filters.location &&
              !ev.cidade?.toLowerCase().includes(filters.location.toLowerCase())
            ) {
              return false
            }

            // Filtro de tipo
            if (
              filters.type &&
              ev.tipo?.toLowerCase() !== filters.type.toLowerCase()
            ) {
              return false
            }

            // Filtro de data
            if (filters.startDate || filters.endDate) {
              const day = Number(ev.data[0])
              const date = new Date(
                year.ano,
                MONTH_MAP[mes.mes.toLowerCase()] || 0,
                day,
              )

              if (filters.startDate && date < new Date(filters.startDate)) {
                return false
              }

              if (filters.endDate && date > new Date(filters.endDate)) {
                return false
              }
            }

            return true
          }),
        }))
        .filter((mes) => mes.eventos.length > 0),
    }))
    .filter((year) => year.meses.length > 0)
}
