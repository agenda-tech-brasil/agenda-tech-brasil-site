import { CalendarIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react'
import { useMemo } from 'react'

import { CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatEventDate, formatShortMonth, isEventPast } from '@/lib/dateUtils'
import { formatEventLocation } from '@/lib/eventUtils'

interface Event {
  nome: string
  data: string[]
  url: string
  cidade: string
  uf: string
  tipo: string
}

interface EventCardProps {
  event: Event
  month: string
  year: number
}

export function EventCard({ event, month, year }: EventCardProps) {
  const formattedDate = formatEventDate(event.data)
  const location = formatEventLocation(event.cidade, event.uf, event.tipo)
  const shortMonth = formatShortMonth(month)

  const isPast = useMemo(() => {
    return isEventPast(event.data, month, year)
  }, [event.data, month, year])

  const cardStyle = isPast
    ? 'opacity-75 grayscale-[35%] border-dashed border-gray-400'
    : 'border-green-600/50 hover:border-green-500'

  return (
    <div
      className={`group relative mx-auto my-4 h-fit w-full rounded-xl border bg-background/40 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl ${cardStyle}`}
    >
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <CardHeader className="relative bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold leading-snug lg:text-lg">
              {event.nome}
            </h2>

            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <CalendarIcon size={16} />
                <span className="text-sm">{`${formattedDate} • ${shortMonth}`}</span>
              </div>
              {isPast && (
                <span className="text-[10px] font-semibold tracking-wide text-red-300 dark:text-red-600">
                  REALIZADO
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 to-transparent px-4 py-3">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'rounded-full px-2.5 py-[2px] text-xs font-medium text-white shadow-sm',
                event.tipo === 'presencial' && 'bg-sky-600/90',
                event.tipo === 'híbrido' && 'bg-purple-900/80',
                event.tipo === 'online' && 'bg-orange-600/90',
                !['presencial', 'híbrido', 'online'].includes(event.tipo) &&
                  'bg-gray-600/20',
              )}
            >
              {event.tipo}
            </span>

            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPinIcon size={14} className="opacity-80" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardContent className="flex items-center justify-between px-4 py-2 text-sm text-primary transition-colors group-hover:bg-primary/5">
          <span className="flex items-center gap-2">
            SAIBA MAIS <ExternalLinkIcon size={15} />
          </span>
          <span className="text-xs text-muted-foreground">
            {new URL(event.url).hostname.replace('www.', '')}
          </span>
        </CardContent>
      </a>
    </div>
  )
}
