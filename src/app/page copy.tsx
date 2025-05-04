'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { Evento, Evento2, Mese } from '@/@types/events'
import { DrawerFilter } from '@/components/DrawerFilter'
import { EventCard } from '@/components/EventCard'
import Footer from '@/components/Footer'
import NoEvents from '@/components/NoEvents'
import { RowFilter } from '@/components/RowFilter'
import ScreenSizeButton from '@/components/ScreenSizeButton'
import { SparklesTextTitle } from '@/components/TitleSparklesText'

import { fetchEvents } from '../utils/fetchEvents'

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Evento[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [anos, setAnos] = useState<string[]>([])
  const [local, setLocal] = useState<string>('') // Filtro pela cidade
  const [startDate, setStartDate] = useState<string>('') // Data inicial (YYYY-MM-DD)
  const [endDate, setEndDate] = useState<string>('') // Data final (YYYY-MM-DD)
  const [tipo, setTipo] = useState<string>('') // Filtro por tipo: presencial, híbrido ou online

  // Estado para controlar o carregamento dos dados
  const [loading, setLoading] = useState<boolean>(true)

  // Mapeamento dos nomes dos meses para índices (0 = janeiro ... 11 = dezembro)
  const monthMapping: { [key: string]: number } = {
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

  /**
   * Função de filtragem que percorre os eventos agrupados por ano e mês
   * aplicando os filtros de ano, cidade, data e tipo.
   */
  const filterEvents = useCallback(
    (eventsData: Evento[], anoSelecionado: string) => {
      // Filtra os dados pelo ano selecionado (caso informado)
      const eventsFilteredByYear = eventsData.filter((yearData) =>
        anoSelecionado ? yearData.ano.toString() === anoSelecionado : true,
      )

      // Para cada ano, percorre os meses e filtra os eventos de acordo com os parâmetros
      const filtrado = eventsFilteredByYear
        .map((yearData) => {
          const mesesFiltrados = yearData.meses
            .map((mesData) => {
              const eventosFiltrados = mesData.eventos.filter((evento) => {
                // Filtro por cidade (campo "cidade")
                if (
                  local &&
                  !evento.cidade?.toLowerCase().includes(local.toLowerCase())
                ) {
                  return false
                }
                // Filtro por tipo (presencial, híbrido ou online)
                if (tipo && evento.tipo?.toLowerCase() !== tipo.toLowerCase()) {
                  return false
                }
                // Filtro por data: usamos o primeiro dia do array "data" para montar a data do evento
                if (startDate || endDate) {
                  const day = Number(evento.data[0])
                  const monthNumber =
                    monthMapping[mesData.mes.toLowerCase()] ?? 0
                  const eventDate = new Date(yearData.ano, monthNumber, day)
                  if (startDate && eventDate < new Date(startDate)) {
                    return false
                  }
                  if (endDate && eventDate > new Date(endDate)) {
                    return false
                  }
                }
                return true
              })
              return { ...mesData, eventos: eventosFiltrados }
            })
            // Remove os meses que não possuem eventos após a filtragem
            .filter((mesData) => mesData.eventos.length > 0)
          return { ...yearData, meses: mesesFiltrados }
        })
        // Remove os anos que não possuem meses com eventos
        .filter((yearData) => yearData.meses.length > 0)

      setFilteredEvents(filtrado)
    },
    [local, startDate, endDate, tipo],
  )

  // Carrega os eventos e define os anos disponíveis
  useEffect(() => {
    const carregarEventos = async () => {
      const eventsData = await fetchEvents()
      setEventos(eventsData)
      const anoAtual = new Date().getFullYear().toString()
      const anosDisponiveis = [
        ...new Set(eventsData.map((e) => e.ano.toString())),
      ]
      setAnos(anosDisponiveis)
      setSelectedYear(anoAtual)
      filterEvents(eventsData, anoAtual)
      setLoading(false) // Dados carregados: desativa o loading
    }
    carregarEventos()
  }, [filterEvents])

  // Reaplica os filtros sempre que algum dos parâmetros mudar
  useEffect(() => {
    filterEvents(eventos, selectedYear)
  }, [eventos, selectedYear, local, startDate, endDate, tipo, filterEvents])

  return (
    <div className="min-h-screen bg-background">
      {process.env.NODE_ENV === 'development' && <ScreenSizeButton />}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/agenda-tech.png"
            alt="Logo Abacatinhos.dev"
            width={150}
            height={150}
            className="mb-4 rounded-full"
            unoptimized
          />
          <SparklesTextTitle />
        </div>

        {/* Componentes de filtro */}
        <DrawerFilter
          years={anos}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          location={local}
          setLocation={setLocal}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          // O parâmetro "mode" aqui representa o tipo de evento (presencial, híbrido ou online)
          mode={tipo}
          setMode={setTipo}
        />
        {loading ? (
          // Exibe um skeleton simples enquanto os eventos não são carregados
          <div className="mt-16 flex justify-center gap-8">
            {/* Skeleton para o título do ano */}
            <div className="mx-auto mb-4 h-8 w-[40rem] animate-pulse cursor-wait rounded bg-slate-800"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="sticky top-0 z-50 bg-background pb-2 pt-2">
            <RowFilter
              years={anos}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              location={local}
              setLocation={setLocal}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              mode={tipo}
              setMode={setTipo}
              eventsData={eventos}
            />
          </div>
        ) : (
          <></>
        )}

        {/* Exibe os eventos filtrados ou um skeleton enquanto os dados não chegam */}
        {loading ? (
          // Exibe um skeleton simples enquanto os eventos não são carregados
          <div className="flex flex-col gap-8">
            <div className="mb-8">
              {/* Skeleton para o título do ano */}
              <div className="mb-4 h-8 w-32 animate-pulse cursor-wait rounded bg-slate-800"></div>
              <div className="mb-8">
                {/* Skeleton para o título do mês */}
                <div className="mb-4 h-6 w-24 animate-pulse cursor-wait rounded bg-slate-800"></div>
                {/* Skeleton para os cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-48 animate-pulse cursor-wait rounded bg-slate-800"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((yearData: Evento) => (
            <div key={yearData.ano} className="mb-8">
              <h2 className="mb-4 text-3xl font-semibold text-primary">
                {yearData.ano}
              </h2>
              {yearData.meses.map((mesData: Mese) => {
                const mesColors = [
                  '#f43f5e',
                  '#10b981',
                  '#3b82f6',
                  '#a855f7',
                  '#f59e0b',
                  '#14b8a6',
                  '#ef4444',
                  '#6366f1',
                  '#ec4899',
                  '#22c55e',
                  '#2563eb',
                  '#eab308',
                ]
                // Calcula o índice do mês para selecionar uma cor
                const monthIndex = new Date(`${mesData.mes} 1, 2000`).getMonth()
                const mesColor = mesColors[monthIndex % mesColors.length]

                return (
                  <div key={mesData.mes} className="mb-8">
                    <h3
                      className="mb-8 text-2xl font-semibold capitalize"
                      style={{ color: mesColor }}
                    >
                      {mesData.mes}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {mesData.eventos.map((evento: Evento2, index: number) => (
                        <EventCard
                          key={`${evento.nome}-${index}`}
                          event={evento}
                          month={mesData.mes}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        ) : (
          // Caso não haja eventos após a filtragem
          <NoEvents />
        )}
      </div>

      <Footer />
    </div>
  )
}
