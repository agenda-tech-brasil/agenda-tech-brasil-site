import { NextRequest, NextResponse } from 'next/server'

import { EventFilters } from '@/@types/events'
import { applyEventFilters } from '@/lib/eventUtils'
import { fetchEvents } from '@/utils/fetchEvents'

/**
 * GET /api/events
 *
 * Retorna lista de eventos com suporte a filtros
 *
 * Query Parameters:
 * - year: Filtrar por ano
 * - location: Filtrar por cidade (busca parcial)
 * - type: Filtrar por tipo (presencial, online, híbrido)
 * - month: Filtrar por mês
 * - startDate: Data inicial (ISO 8601)
 * - endDate: Data final (ISO 8601)
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar eventos
    const events = await fetchEvents()

    // Extrair parâmetros de query
    const searchParams = request.nextUrl.searchParams
    const filters: EventFilters = {
      year: searchParams.get('year') || undefined,
      location: searchParams.get('location') || undefined,
      type: searchParams.get('type') || undefined,
      month: searchParams.get('month') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    }

    // Validar tipo se fornecido
    if (filters.type) {
      const validTypes = ['presencial', 'online', 'híbrido']
      if (!validTypes.includes(filters.type.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `Parâmetro inválido: type deve ser 'presencial', 'online' ou 'híbrido'`,
          },
          { status: 400 },
        )
      }
    }

    // Validar mês se fornecido
    if (filters.month) {
      const validMonths = [
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
      ]
      if (!validMonths.includes(filters.month.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `Parâmetro inválido: month deve ser um mês válido em português`,
          },
          { status: 400 },
        )
      }
    }

    // Aplicar filtros
    const filteredEvents = applyEventFilters(events, filters)

    // Retornar resposta
    return NextResponse.json(
      {
        success: true,
        data: filteredEvents,
        total: filteredEvents.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar eventos. Por favor, tente novamente mais tarde.',
      },
      { status: 500 },
    )
  }
}
