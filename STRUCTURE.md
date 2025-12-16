# Estrutura do Projeto - Agenda Tech Brasil

## 📁 Organização de Pastas

```
src/
├── @types/          # Definições de tipos TypeScript
│   └── events.ts    # Interfaces para eventos
│
├── app/             # Next.js App Router
│   ├── layout.tsx   # Layout principal
│   ├── page.tsx     # Página inicial
│   └── globals.css  # Estilos globais
│
├── components/      # Componentes React
│   ├── ui/          # Componentes de UI reutilizáveis
│   ├── EventList.tsx        # Lista principal de eventos
│   ├── EventCard.tsx        # Card individual de evento
│   ├── EventFilters.tsx     # Filtros de eventos
│   ├── DrawerFilter.tsx     # Filtros mobile (drawer)
│   ├── RowFilter.tsx        # Filtros desktop (row)
│   ├── FilterEvents.tsx     # Lógica de filtragem (re-export)
│   └── ...          # Outros componentes
│
├── lib/             # Utilitários e constantes
│   ├── constants.ts # Constantes da aplicação
│   ├── dateUtils.ts # Funções de data
│   ├── eventUtils.ts # Funções de eventos
│   └── utils.ts     # Utilitários gerais
│
└── utils/           # Utilitários externos
    └── fetchEvents.ts # Busca eventos da API
```

## 🎯 Principais Componentes

### EventList

Componente principal que:

- Gerencia o estado dos filtros
- Renderiza a lista de eventos filtrados
- Controla loading e estados vazios

### EventCard

Card individual de evento que:

- **RECEBE O ANO** como prop
- Calcula se evento já passou
- Mostra badge "REALIZADO" para eventos passados
- Aplica estilo diferente (grayscale) para eventos passados

### Filtros

Dois componentes de filtro:

- **DrawerFilter**: Para mobile (drawer lateral)
- **RowFilter**: Para desktop (linha de filtros)

Ambos compartilham as mesmas props e lógica.

## 📦 Módulos Criados

### `/lib/constants.ts`

Centraliza todas as constantes para evitar duplicação:

- Nomes e índices de meses
- Tipos de eventos
- Cores das badges
- Domínios bloqueados

### `/lib/dateUtils.ts`

Funções puras para manipulação de datas:

- Normalização de nomes de meses
- Verificação de eventos passados
- Formatação de datas

### `/lib/eventUtils.ts`

Funções de lógica de negócio:

- Extração de tipos e anos únicos
- Aplicação de filtros
- Formatação de dados

## 🔄 Fluxo de Dados

```
1. fetchEvents() → Busca eventos da API
2. EventList recebe initialEvents
3. Aplica filtros via applyEventFilters()
4. Renderiza EventCard para cada evento
5. EventCard calcula isPast corretamente com ano
```

## 🎨 Convenções

### Imports

```typescript
// 1. React e bibliotecas externas
import { useState } from "react";

// 2. Tipos
import { Evento } from "@/@types/events";

// 3. Constantes e utils
import { MONTH_NAMES } from "@/lib/constants";

// 4. Componentes
import { EventCard } from "./EventCard";
```

### Nomenclatura

- **Componentes**: PascalCase (`EventCard.tsx`)
- **Utilitários**: camelCase (`dateUtils.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MONTH_NAMES`)
- **Funções**: camelCase (`isEventPast`)

