import { CalendarIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CardContent, CardHeader } from '@/components/ui/card'

interface Event {
  nome: string
  data: string[]
  url: string
  cidade: string
  uf: string
  tipo: string
}

const getBadgeColor = (tipo: string) => {
  switch (tipo) {
    case 'presencial':
      return 'bg-sky-600/90'
    case 'híbrido':
      return 'bg-purple-900/80'
    case 'online':
      return 'bg-orange-600/90'
    default:
      return 'bg-background/20'
  }
}

export function EventCard({ event, month }: { event: Event; month: string }) {
  const [iframeAllowed, setIframeAllowed] = useState(true)

  const formattedDate =
    event.data.length > 1
      ? `${event.data[0]} - ${event.data[event.data.length - 1]}`
      : event.data[0]

  const location =
    event.cidade && event.uf
      ? `${event.cidade}, ${event.uf}`
      : event.tipo === 'online'
        ? ''
        : 'Sem informação de local'

  const shortMonth = month.slice(0, 3).toUpperCase()

  useEffect(() => {
    const blockedDomains = [
      'https://www.meetup.com',
      'https://www.sympla.com.br',
      'https://www.instagram.com',
    ]
    if (blockedDomains.some((domain) => event.url.startsWith(domain))) {
      setIframeAllowed(false)
    }
  }, [event.url])

  const isPast = useMemo(() => {
    if (!event.data.length) return false

    const lastDay = event.data[event.data.length - 1]

    const monthMap: { [key: string]: number } = {
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

    const normalizedMonth = month
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const monthIndex = monthMap[normalizedMonth]
    const currentYear = new Date().getFullYear()
    const eventDate = new Date(currentYear, monthIndex, parseInt(lastDay))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return eventDate < today
  }, [event.data, month])

  const cardStyle = isPast
    ? 'opacity-75 grayscale-[35%] border-dashed border-gray-400'
    : 'border-green-600/50 hover:border-green-500'

  return (
    <div
      className={`group relative mx-auto my-4 w-full h-fit rounded-xl border bg-background/40 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl ${cardStyle}`}
    >
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl overflow-hidden"
      >
        <CardHeader className="relative bg-primary text-primary-foreground px-4 py-3">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold leading-snug lg:text-lg">
              {event.nome}
            </h2>

            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <CalendarIcon size={16}  />
                <span className='text-sm'>{`${formattedDate} • ${shortMonth}`}</span>
              </div>
              {isPast && (
                <span className="text-[10px] font-semibold text-red-300 dark:text-red-600 tracking-wide">
                  REALIZADO
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 px-4 py-3 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-2.5 py-[2px] text-xs font-medium ${getBadgeColor(
                event.tipo,
              )} shadow-sm`}
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

        <CardContent className="flex items-center justify-between px-4 py-2 text-sm text-primary group-hover:bg-primary/5 transition-colors">
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
