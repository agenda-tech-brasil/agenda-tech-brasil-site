import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { EventFilters } from './EventFilters'
import { RainbowButtonFilter } from './RaibowButtonFilter'
import { Input } from './ui/input'

interface EventFiltersProps {
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
}

export function DrawerFilter({
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
}: EventFiltersProps) {
  const eventModes = ['Online', 'Híbrido', 'Presencial']
  const [showButton, setShowButton] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        setShowButton(false)
      } else {
        setShowButton(true)
      }
      setLastScrollY(window.scrollY)
    }
  }, [lastScrollY])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className={`
            fixed bottom-4 right-4 z-10 
            transition-all duration-500 ease-in-out
            ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
          `}
        >
          <RainbowButtonFilter />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-xs">
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className="text-lg">Filtrar</DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500">
              Ajuste os filtros conforme necessário.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-2 p-2">
            {/* Filtro de Ano */}
            <label className="block text-sm font-medium">Ano</label>
            <EventFilters
              onYearChange={onYearChange}
              selectedYear={selectedYear}
              years={years}
            />

            {/* Filtro de Localidade */}
            <div className="space-y-2">
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
            <div>
              <label className="block text-sm font-medium">
                Data de Início
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border p-1 text-sm"
              />
            </div>

            {/* Filtro de Data de Fim */}
            <div>
              <label className="block text-sm font-medium">Data de Fim</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border p-1 text-sm"
              />
            </div>

            {/* Filtro de Modelo */}
            <div>
              <label className="block text-sm font-medium">Modelo</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-md border p-1 text-sm"
              >
                <option value="">Todos</option>
                {eventModes.map((modeOption) => (
                  <option key={modeOption} value={modeOption.toLowerCase()}>
                    {modeOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DrawerFooter className="space-x-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full text-sm">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
