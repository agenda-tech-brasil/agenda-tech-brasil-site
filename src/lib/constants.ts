/**
 * Constantes usadas em toda a aplicação
 */

export const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const

export const MONTH_MAP: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  marco: 2, // março sem acento (normalizado)
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

export const EVENT_TYPES = {
  PRESENCIAL: 'presencial',
  HIBRIDO: 'híbrido',
  ONLINE: 'online',
} as const

export const BADGE_COLORS = {
  presencial: 'bg-sky-600/90',
  híbrido: 'bg-purple-900/80',
  online: 'bg-orange-600/90',
  default: 'bg-gray-600/20',
} as const

export const BLOCKED_IFRAME_DOMAINS = [
  'https://www.meetup.com',
  'https://www.sympla.com.br',
  'https://www.instagram.com',
] as const
