'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { Evento } from '@/@types/events'
import { MONTH_NAMES } from '@/lib/constants'
import { isEventPast } from '@/lib/dateUtils'
import { getUniqueYears } from '@/lib/eventUtils'

import { DrawerFilter } from './DrawerFilter'
import { EventCard } from './EventCard'
import { applyEventFilters } from './FilterEvents'
import Footer from './Footer'
import NoEvents from './NoEvents'
import { RowFilter } from './RowFilter'
import ScreenSizeButton from './ScreenSizeButton'
import { ThemeToggle } from './ThemeToggle'
import { SparklesTextTitle } from './TitleSparklesText'

interface Props {
  initialEvents: Evento[]
}

export default function EventList({ initialEvents }: Props) {
  const eventos = initialEvents
  const [filteredEvents, setFilteredEvents] = useState<Evento[]>([])
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear().toString(),
  )
  const [selectedMonth, setSelectedMonth] = useState('')
  const [local, setLocal] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tipo, setTipo] = useState('')
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const anos = useMemo(() => getUniqueYears(initialEvents), [initialEvents])

  // Detecta se rolou a página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const filtros = {
      year: selectedYear,
      location: local,
      type: tipo,
      startDate,
      endDate,
      month: selectedMonth,
    }
    setFilteredEvents(applyEventFilters(eventos, filtros))
    setLoading(false)
  }, [eventos, selectedYear, selectedMonth, local, startDate, endDate, tipo])

  useEffect(() => {
    if (!loading && filteredEvents.length > 0) {
      // Encontrar o primeiro evento não realizado
      let firstUpcomingEventId: string | null = null

      outerLoop: for (const yearData of filteredEvents) {
        for (const mesData of yearData.meses) {
          for (let idx = 0; idx < mesData.eventos.length; idx++) {
            const evento = mesData.eventos[idx]
            const eventIsPast = isEventPast(
              evento.data,
              mesData.mes,
              yearData.ano,
            )

            if (!eventIsPast) {
              firstUpcomingEventId = `event-${yearData.ano}-${mesData.mes}-${idx}`
              break outerLoop
            }
          }
        }
      }

      // Se encontrou um evento futuro, faz scroll até ele
      if (firstUpcomingEventId) {
        const el = document.getElementById(firstUpcomingEventId)
        if (el) {
          const yOffset = -100
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      } else {
        // Fallback: scroll para o mês atual se não houver eventos futuros
        const hoje = new Date()
        const nomeMes = MONTH_NAMES[hoje.getMonth()]
        const el = document.getElementById(`month-${nomeMes}`)
        if (el) {
          const yOffset = -85
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }
    }
  }, [filteredEvents, loading])

  const sharedFilterProps = {
    years: anos,
    selectedYear,
    onYearChange: setSelectedYear,
    selectedMonth,
    onMonthChange: setSelectedMonth,
    location: local,
    setLocation: setLocal,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    mode: tipo,
    setMode: setTipo,
  }

  return (
    <div className="min-h-screen bg-background">
      {process.env.NODE_ENV === 'development' && <ScreenSizeButton />}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center gap-2 lg:gap-4">
          <div className="relative w-full">
            <div
              className={`absolute right-0 top-0 transition-opacity duration-300 ${
                isScrolled ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <ThemeToggle />
            </div>
            <div className="flex flex-col items-center gap-2 lg:gap-4">
              <Image
                className="rounded-full"
                src="/agenda-tech.png"
                alt="Logo"
                width={150}
                height={150}
                unoptimized
              />
              <SparklesTextTitle />
            </div>
          </div>
        </div>

        <DrawerFilter {...sharedFilterProps} />

        {loading ? (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 w-full animate-pulse cursor-wait rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="sticky top-0 z-20 bg-background py-2">
            <RowFilter
              {...sharedFilterProps}
              eventsData={eventos}
              showThemeToggle={isScrolled}
            />
          </div>
        )}

        {!loading &&
          filteredEvents.map((yearData) => (
            <div key={yearData.ano} className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-primary">
                {yearData.ano}
              </h2>
              {yearData.meses.map((mesData) => (
                <div
                  key={mesData.mes}
                  id={`month-${mesData.mes.toLowerCase()}`}
                  className="mb-8 scroll-mt-12"
                >
                  <h3 className="mb-6 text-2xl font-semibold capitalize">
                    {mesData.mes}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mesData.eventos.map((evento, idx) => (
                      <div
                        key={`${evento.nome}-${idx}`}
                        id={`event-${yearData.ano}-${mesData.mes}-${idx}`}
                      >
                        <EventCard
                          event={evento}
                          month={mesData.mes}
                          year={yearData.ano}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        {!loading && filteredEvents.length === 0 && <NoEvents />}
      </div>
      <Footer />
    </div>
  )
}
