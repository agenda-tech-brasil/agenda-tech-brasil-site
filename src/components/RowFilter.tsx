'use client'

import { FilterIcon, XCircleIcon } from 'lucide-react'
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
import { Button } from './ui/button'
import { Input } from './ui/input'

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
  const uniqueEventTypes = useMemo(() => {
    if (!eventsData) return ['online', 'híbrido', 'presencial']
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

  const clearPastEvents = () => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
    setEndDate('')
  }

  const clearFilters = () => {
    setMode('')
    setLocation('')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="flex flex-wrap items-end justify-center gap-4 bg-background p-4 max-lg:hidden">
      {/* Ano */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-muted-foreground">
          Ano
        </label>
        <EventFilters
          onYearChange={onYearChange}
          selectedYear={selectedYear}
          years={years}
        />
      </div>

      {/* Tipo */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-muted-foreground">
          Tipo
        </label>
        <Select
          value={mode || 'all'}
          onValueChange={(val) => setMode(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-36">
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

      {/* Localidade */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-muted-foreground">
          Localidade
        </label>
        <Input
          type="text"
          placeholder="Digite o local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-36"
        />
      </div>

      {/* Data Início */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-muted-foreground">
          Início
        </label>
        <div className="relative">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36 text-sm"
          />
        </div>
      </div>

      {/* Data Fim */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-muted-foreground">
          Fim
        </label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-36 text-sm"
        />
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-2 xl:flex-row">
        <Button
          onClick={clearPastEvents}
          variant="outline"
          className="flex items-center gap-2 bg-transparent text-xs"
        >
          <FilterIcon className="h-4 w-4" />
          Ocultar passados
        </Button>
        <Button
          onClick={clearFilters}
          variant="ghost"
          className="flex items-center gap-2 text-xs text-red-500"
        >
          <XCircleIcon className="h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}
