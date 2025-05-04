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
  const [showPreview, setShowPreview] = useState(false)
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

  // Bloquear URLs de sites que não permitem iframe
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

    // Mapeamento de meses em português para índices (0-11)
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

    // Converte para minúsculas e remove acentos para segurança
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
  // Estilo adicional para eventos passados
  const cardStyle = isPast
    ? 'opacity-75 grayscale-[40%] border-dashed'
    : 'border-green-600/50 hover:border-green-500'

  return (
    <div
      className={`group relative mx-auto mt-2 w-full max-w-md lg:max-w-lg ${cardStyle}`}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        className={`w-full overflow-hidden rounded-lg border transition-shadow hover:shadow-lg `}
      >
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <CardHeader className="bg-primary px-0 pb-1 pt-0.5 text-primary-foreground">
            <h2 className="x2:pr-28 px-4 py-1.5 pr-36 text-left text-lg font-bold lg:text-xl">
              {event.nome}
            </h2>
            <div className="flex flex-row justify-between gap-2 px-3 pb-2">
              <div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs text-zinc-50 md:text-sm ${getBadgeColor(
                    event.tipo,
                  )}`}
                >
                  {event.tipo}
                </span>
              </div>
              <div>
                {location && (
                  <div className="flex items-center gap-1 text-sm md:text-base">
                    <MapPinIcon size={16} />
                    <h3>{location}</h3>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -top-[1.70rem] right-3 flex flex-col rounded-md border-t-[0.10px] border-primary/40 bg-primary/10 px-[0.25px]">
              <span className="mt-1 flex flex-col items-center justify-center gap-2 text-base text-foreground md:text-lg">
                {isPast && (
                  <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-center rounded-t-lg bg-slate-900/90 py-[1px] text-xs font-semibold text-white">
                    REALIZADO
                  </div>
                )}
                <CalendarIcon size={14} />{' '}
                <div className="flex">
                  <span className="text-lg text-zinc-800 md:text-xl">
                    {`${formattedDate} - ${shortMonth}`}
                  </span>
                </div>
              </span>
            </div>
          </CardHeader>

          {/* Prévia com IFRAME em forma de "nuvem" acima do card */}
          {showPreview && iframeAllowed && (
            <div className="absolute left-1/2 top-[-260px] z-20 h-[250px] w-[400px] -translate-x-1/2 rounded-lg border bg-white shadow-xl">
              <iframe
                src={event.url}
                title="Prévia do Evento"
                className="h-full w-full rounded-lg"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onError={() => setIframeAllowed(false)}
              />
              {/* Seta apontando para baixo */}
              <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          )}

          <CardContent className="hidden bg-gradient-to-b from-primary/5 to-transparent p-2 group-hover:block">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm md:text-base"
            >
              SAIBA MAIS <ExternalLinkIcon size={17} className="mb-1" />
            </a>
          </CardContent>
        </a>
      </div>
    </div>
  )
}
