import { FilterIcon } from 'lucide-react'

import { RainbowButton } from './ui/rainbow-button'

export function RainbowButtonFilter() {
  return (
    <RainbowButton>
      <FilterIcon className="text-white" />
    </RainbowButton>
  )
}
