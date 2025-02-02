'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { Evento, Evento2, Mese } from '@/@types/events'
import { DrawerFilter } from '@/components/DrawerFilter'
import { EventCard } from '@/components/EventCard'
import LinksWithIcons from '@/components/iconsLink'
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
            src="/logo.png"
            alt="Logo Abacatinhos.dev"
            width={150}
            height={150}
            className="mb-4 rounded-full"
            unoptimized
          />
          <SparklesTextTitle />
        </div>

        {/* Componente de filtro */}
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

        {/* Exibe os eventos filtrados */}
        {filteredEvents.map((yearData: Evento) => (
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
        ))}
      </div>

      <footer className="bg-zinc-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 text-center md:flex-row md:items-start md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-semibold">Eventos Tech Brasil</h2>
              <p className="mt-5">
                Sabe aquele evento de tecnologia que você procura, mas não sabe
                onde encontrar? Este site reúne em um só lugar informações sobre
                eventos de tecnologia no Brasil!
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-semibold">Mais Informações</h3>
              <p className="mt-4">
                Criado por{' '}
                <a
                  href="https://github.com/pachicodes"
                  className="text-primary underline"
                >
                  @pachicodes
                </a>{' '}
                e mantido por colaboradores como{' '}
                <a
                  href="https://github.com/stephan-lopes"
                  className="text-primary underline"
                >
                  @stephan-lopes
                </a>
                . O site foi desenvolvido inicialmente por{' '}
                <a
                  href="https://github.com/fabiobrasileiroo"
                  className="text-primary underline"
                >
                  @fabiobrasileiroo
                </a>
                .
              </p>
            </div>
          </div>
          <LinksWithIcons />
          <div className="mt-8 text-center text-sm text-gray-400">
            Feito com 💚 por Eventos Tech Brasil
          </div>
        </div>
      </footer>
    </div>
  )
}
