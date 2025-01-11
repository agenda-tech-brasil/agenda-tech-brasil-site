import { Evento2 } from '@/@types/events'

const EventBadge = (event: Evento2) => {
  // FunÃ§Ã£o para determinar a cor com base no tipo de evento
  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'prensecial':
        return 'bg-blue-600' // Cor para 'Workshop'
      case 'hebrido':
        return 'bg-green-600' // Cor para 'SeminÃ¡rio'
      case 'online':
        return 'bg-red-600' // Cor para 'ConferÃªncia'
      default:
        return 'bg-background/20' // Cor padrÃ£o
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`rounded-full px-2 py-1 text-xs font-semibold text-primary ${getBadgeColor(
          event.tipo,
        )}`}
      >
        {event.tipo}
      </span>
    </div>
  )
}

export default EventBadge
