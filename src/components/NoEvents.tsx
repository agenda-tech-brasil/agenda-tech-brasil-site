'use client'
import Image from 'next/image'

// Se estiver usando Next.js

const NoEvents: React.FC = () => {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center text-center text-xl text-slate-100">
      <p>Nenhum evento encontrado.</p>
      <Image
        width={80}
        height={80}
        src="/no-events.gif"
        alt="Nenhum evento encontrado"
      />
    </div>
  )
}

export default NoEvents
