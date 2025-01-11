import { CalendarIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react'

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

  return (
    <div className="group relative mx-auto mt-2 w-full max-w-md lg:max-w-lg">
      <div className="w-full overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <CardHeader className="bg-primary px-0 pb-1 pt-0.5 text-primary-foreground">
            <h2 className="x2:pr-28 px-4 py-1.5 pr-36 text-left text-lg  font-bold lg:text-xl">
              {event.nome}
            </h2>
            <div className="flex flex-row justify-between  gap-2 px-3 pb-2">
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
                {location !== '' && (
                  <div className="flex items-center gap-1 text-sm md:text-base">
                    <MapPinIcon size={16} />
                    <h3>{location}</h3>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -top-[1.70rem]  right-3 flex flex-col rounded-md border-t-[0.10px] border-primary/40 bg-primary/10 px-[0.25px]">
              <span className="mt-1 flex  flex-col items-center justify-center gap-2 text-base text-foreground md:text-lg">
                <CalendarIcon size={14} />{' '}
                <div className="flex">
                  <span className="text-lg text-zinc-800 md:text-xl">
                    {' '}
                    {`${formattedDate} - ${shortMonth}`}
                  </span>
                </div>
              </span>
            </div>
          </CardHeader>

          {/* Aqui está o ajuste para exibir apenas no hover */}
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
