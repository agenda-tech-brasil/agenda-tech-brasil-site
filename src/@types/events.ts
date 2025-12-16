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
  modelo: string 
  dataFim: string | number | Date
  dataInicio: string | number | Date
  localidade: string 
  ano: number
  arquivado: boolean
  meses: Meses[]
}


export interface EventFilters {
  year?: string
  location?: string
  type?: string
  startDate?: string
  endDate?: string
  month?: string 
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
