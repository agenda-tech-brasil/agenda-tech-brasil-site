export interface Evento2 {
  nome: string
  data: string[]
  url: string
  cidade: string
  uf: string
  tipo: string
}

export interface Meses {
  mes: string
  arquivado: boolean
  eventos: Evento2[]
}

export interface Evento {
  modelo: string // Replaced 'any' with a more specific type
  dataFim: string | number | Date
  dataInicio: string | number | Date
  localidade: string // Replaced 'any' with 'string'
  ano: number
  arquivado: boolean
  meses: Meses[]
}

// Nova interface para filtros
export interface EventFilters {
  year?: string
  location?: string
  type?: string
  startDate?: string
  endDate?: string
  month?: string // Novo filtro por mês
}

export interface Tba {
  nome: string
  url: string
  cidade: string
  uf: string
  tipo: string
}

export interface Root {
  eventos: Evento[]
  tba: Tba[]
}
