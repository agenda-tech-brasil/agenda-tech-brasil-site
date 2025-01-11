'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const [local, setLocal] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [modo, setModo] = useState<string>('')

  const mesRefs = useRef<{ [chave: string]: HTMLDivElement | null }>({})

  // ✅ Corrigido: Declaração de filterEvents antes de ser usado
  const filterEvents = useCallback(
    (eventsData: Evento[], anoSelecionado: string) => {
      const filtrado = eventsData.filter((evento) => {
        if (anoSelecionado && evento.ano.toString() !== anoSelecionado)
          return false

        if (
          local &&
          !evento.localidade?.toLowerCase().includes(local.toLowerCase())
        )
          return false

        const dataInicioEvento = new Date(evento.dataInicio)
        const dataFimEvento = new Date(evento.dataFim)
        if (dataInicio && dataInicioEvento < new Date(dataInicio)) return false
        if (dataFim && dataFimEvento > new Date(dataFim)) return false

        // ✅ Verificação segura para evitar erro de undefined
        if (modo && evento.modelo?.toLowerCase() !== modo.toLowerCase())
          return false

        return true
      })

      setFilteredEvents(filtrado)
    },
    [local, dataInicio, dataFim, modo],
  )

  // ✅ Corrigido: filterEvents incluído nas dependências
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
  }, [filterEvents]) // ✅ filterEvents incluído nas dependências

  useEffect(() => {
    filterEvents(eventos, selectedYear)
  }, [eventos, selectedYear, local, dataInicio, dataFim, modo, filterEvents]) // ✅ filterEvents incluído

  return (
    <div className="min-h-screen bg-background">
      {/* <ScreenSizeButton /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Logo Abacatinhos.dev"
            width={150}
            height={150}
            className="mb-4 rounded-full"
          />
          <SparklesTextTitle />
        </div>

        <DrawerFilter
          years={anos}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          location={local}
          setLocation={setLocal}
          startDate={dataInicio}
          setStartDate={setDataInicio}
          endDate={dataFim}
          setEndDate={setDataFim}
          mode={modo}
          setMode={setModo}
        />

        {filteredEvents.map((yearData: Evento) => (
          <div key={yearData.ano} className="mb-8">
            <h2 className="mb-4 text-3xl font-semibold text-primary">
              {yearData.ano}
            </h2>
            {yearData.meses.map((mesData: Mese, mesIndex: number) => {
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
              const mesColor = mesColors[mesIndex % mesColors.length]

              return (
                <div
                  key={mesData.mes}
                  className="mb-8"
                  ref={(el) => {
                    mesRefs.current[mesData.mes.toLowerCase()] = el
                  }}
                >
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


      < footer className="bg-zinc-900 py-8 text-white" >
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
      </footer >

    </div>
  )
}
