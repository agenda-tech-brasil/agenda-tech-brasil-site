import { MONTH_MAP } from './constants'

/**
 * Normaliza o nome do mês removendo acentos
 */
export function normalizeMonthName(month: string): string {
  return month
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Verifica se um evento já passou
 * @param eventDate - Última data do evento (array de dias)
 * @param month - Nome do mês
 * @param year - Ano do evento
 * @returns true se o evento já passou
 */
export function isEventPast(
  eventDate: string[],
  month: string,
  year: number,
): boolean {
  if (!eventDate.length) return false

  const lastDay = eventDate[eventDate.length - 1]
  const normalizedMonth = normalizeMonthName(month)
  const monthIndex = MONTH_MAP[normalizedMonth]

  if (monthIndex === undefined) return false

  const eventDateObj = new Date(year, monthIndex, parseInt(lastDay))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return eventDateObj < today
}

/**
 * Formata uma data ou range de datas
 */
export function formatEventDate(dates: string[]): string {
  if (dates.length === 0) return ''
  if (dates.length === 1) return dates[0]
  return `${dates[0]} - ${dates[dates.length - 1]}`
}

/**
 * Formata o nome do mês abreviado
 */
export function formatShortMonth(month: string): string {
  return month.slice(0, 3).toUpperCase()
}

/**
 * Retorna a data de hoje no formato ISO (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}
