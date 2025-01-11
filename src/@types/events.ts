export interface Evento2 {
  nome: string
  data: string[]
  url: string
  cidade: string
  uf: string
  tipo: string
}

export interface Mese {
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
  meses: Mese[]
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
