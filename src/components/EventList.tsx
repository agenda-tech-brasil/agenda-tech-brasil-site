'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { Evento } from '@/@types/events'

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

  const anos = useMemo(
    () => [...new Set(initialEvents.map((e) => e.ano.toString()))],
    [initialEvents],
  )

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
      const monthNames = [
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
      const hoje = new Date()
      const nomeMes = monthNames[hoje.getMonth()]
      const el = document.getElementById(`month-${nomeMes}`)
      if (el) {
        const yOffset = -85
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
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

  if (!loading && filteredEvents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <NoEvents />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {process.env.NODE_ENV === 'development' && <ScreenSizeButton />}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center gap-2 lg:gap-4">
          <div className="relative w-full">
            <div className="absolute right-0 top-0">
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
            <RowFilter {...sharedFilterProps} eventsData={eventos} />
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
                      <EventCard
                        key={`${evento.nome}-${idx}`}
                        event={evento}
                        month={mesData.mes}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
      <Footer />
    </div>
  )
}
