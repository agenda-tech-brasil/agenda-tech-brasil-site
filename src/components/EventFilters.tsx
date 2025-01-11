'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EventFiltersProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function EventFilters({
  years,
  selectedYear,
  onYearChange,
}: EventFiltersProps) {
  return (
    <div className="mb-8 flex justify-center">
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
