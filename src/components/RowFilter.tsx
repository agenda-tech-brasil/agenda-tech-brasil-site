'use client'

import { FilterIcon, XCircleIcon } from 'lucide-react'
import * as React from 'react'
import { useMemo } from 'react'

import { Evento } from '@/@types/events'
import { MONTH_NAMES } from '@/lib/constants'
import { getTodayISO } from '@/lib/dateUtils'
import { getUniqueEventTypes } from '@/lib/eventUtils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { EventFilters } from './EventFilters'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface RowFilterProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
  selectedMonth: string
  onMonthChange: (month: string) => void
  location: string
  setLocation: (location: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  mode: string
  setMode: (mode: string) => void
  eventsData?: Evento[]
  showThemeToggle?: boolean
}

export function RowFilter({
  years,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  location,
  setLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  mode,
  setMode,
  eventsData,
  showThemeToggle = false,
}: RowFilterProps) {
  const uniqueEventTypes = useMemo(() => {
    if (!eventsData) return ['online', 'híbrido', 'presencial']
    return getUniqueEventTypes(eventsData)
  }, [eventsData])

  const clearPastEvents = () => {
    setStartDate(getTodayISO())
    setEndDate('')
  }

  const clearFilters = () => {
    setMode('')
    setLocation('')
    setStartDate('')
    setEndDate('')
    onMonthChange('')
  }

  const monthOptions = MONTH_NAMES

  return (
    <div className="flex flex-wrap items-end justify-between gap-2 bg-background py-2 px-0 2xl:px-4 2xl:gap-4 max-lg:hidden">
      <div className="flex flex-wrap items-end justify-center gap-2 2xl:gap-4 flex-1">
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

        {/* Mês */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-muted-foreground">
            Mês
          </label>
          <Select
            value={selectedMonth || 'all'}
            onValueChange={(val) => onMonthChange(val === 'all' ? '' : val)}
          >
            <SelectTrigger className="w-28 xl:w-36">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <SelectTrigger className="w-28 xl:w-36">
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
            className="w-28 xl:w-36"
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
              className="w-32 xl:w-40 text-sm"
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
            className="w-32 xl:w-40 text-sm"
          />
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-1 xl:gap-2 xl:flex-row">
          <Button
            onClick={clearPastEvents}
            variant="outline"
            className="flex items-center gap-1 xl:gap-2 bg-transparent text-xs px-2 xl:px-4"
          >
            <FilterIcon className="h-3 w-3 xl:h-4 xl:w-4" />
            <span className="hidden xl:inline">Ocultar passados</span>
            <span className="xl:hidden">Passados</span>
          </Button>
          <Button
            onClick={clearFilters}
            variant="ghost"
            className="flex items-center gap-1 xl:gap-2 text-xs text-red-500 px-2 xl:px-4"
          >
            <XCircleIcon className="h-3 w-3 xl:h-4 xl:w-4" />
            <span className="hidden xl:inline">Limpar filtros</span>
            <span className="xl:hidden">Limpar</span>
          </Button>
        </div>
      </div>

      {/* Theme Toggle - só aparece quando rolado */}
      {showThemeToggle && (
        <div className="flex items-end animate-in fade-in duration-300">
          <ThemeToggle />
        </div>
      )}
    </div>
  )
}
