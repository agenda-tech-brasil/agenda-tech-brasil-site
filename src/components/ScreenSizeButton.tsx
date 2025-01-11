'use client'

import { useEffect, useState } from 'react'

type ScreenSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const ScreenSizeButton: React.FC = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('sm')

  const handleResize = (): void => {
    const width = window.innerWidth
    if (width < 640) {
      setScreenSize('sm')
    } else if (width >= 640 && width < 768) {
      setScreenSize('md')
    } else if (width >= 768 && width < 1024) {
      setScreenSize('lg')
    } else if (width >= 1024 && width < 1280) {
      setScreenSize('xl')
    } else {
      setScreenSize('2xl')
    }
  }

  useEffect(() => {
    handleResize() // Executa no carregamento
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <button
      className="
        fixed bottom-5 left-5
        transform rounded-full
        bg-zinc-800 px-4 py-2
        text-sm text-white
        shadow-lg transition-transform hover:scale-105
        hover:bg-zinc-700 sm:text-base md:text-lg
      "
    >
      {`${screenSize}`}
    </button>
  )
}

export default ScreenSizeButton
