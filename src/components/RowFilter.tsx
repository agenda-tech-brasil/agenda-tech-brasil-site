'use client'

import * as React from 'react'
import { useMemo } from 'react'

import { Evento } from '@/@types/events'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { EventFilters } from './EventFilters'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'

interface RowFilterProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
  location: string
  setLocation: (location: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  mode: string
  setMode: (mode: string) => void
  /**
   * Dados dos eventos (array de objetos agrupados por ano e mês)
   * para extrair dinamicamente os tipos disponíveis.
   */
  eventsData?: Evento[]
}

export function RowFilter({
  years,
  selectedYear,
  onYearChange,
  location,
  setLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  mode,
  setMode,
  eventsData,
}: RowFilterProps) {
  // Se os dados dos eventos foram passados, extrai os tipos únicos;
  // caso contrário, usa um array padrão.
  const uniqueEventTypes = useMemo(() => {
    if (!eventsData) {
      return ['online', 'híbrido', 'presencial']
    }
    const types = new Set<string>()
    eventsData.forEach((yearData) => {
      yearData.meses.forEach((mes) => {
        mes.eventos.forEach((evento) => {
          if (evento.tipo) {
            types.add(evento.tipo.toLowerCase())
          }
        })
      })
    })
    return Array.from(types)
  }, [eventsData])

  const todayDate = (() => {
    const todayBrFormat = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(",")[0].replaceAll("/", "-")
    const todayUSFormat = `${todayBrFormat.split("-")[2]}-${todayBrFormat.split("-")[1]}-${todayBrFormat.split("-")[0]}`
    setStartDate(todayUSFormat)
  })

  return (
    // Este container é exibido apenas em telas menores que md (hidden em md e acima)
    <div className="flex flex-row items-center justify-center gap-4 p-2 max-lg:hidden">
      {/* Filtro de Ano */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium">Ano</label>
        <EventFilters
          onYearChange={onYearChange}
          selectedYear={selectedYear}
          years={years}
        />
      </div>
      {/* Filtro de Tipo */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium">Tipo</label>
        <Select
          value={mode === '' ? 'all' : mode}
          onValueChange={(val) => setMode(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {uniqueEventTypes.map((typeOption) => (
              <SelectItem key={typeOption} value={typeOption}>
                {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Localidade */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium">Localidade</label>
        <Input
          type="text"
          placeholder="Digite o local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-md border p-1 text-sm"
        />
      </div>

      {/* Filtro de Data de Início */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium">Data de Início</label>

        <div className="relative">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border p-1 pr-10 text-sm text-white 
                 placeholder-white focus:ring-white"
          />
          <Button
            type="button"
            onClick={todayDate} // função que você definir
            className="absolute bg-black right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-black"
          >
            <CalendarIcon className="text-white h-4 w-4 opacity-50" />
          </Button>
        </div>
      </div>


      {/* Filtro de Data de Fim */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium">Data de Fim</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-md border p-1 text-sm"
        />
      </div>
    </div>
  )
}
