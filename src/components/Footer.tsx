import Link from 'next/link'

import LinksWithIcons from './iconsLink'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 text-center md:flex-row md:items-start md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-semibold">Eventos Tech Brasil</h2>
            <p className="mt-5">
              Sabe aquele evento de tecnologia que você procura, mas não sabe
              onde encontrar? Este site reúne em um só lugar informações sobre
              eventos de tecnologia no Brasil!
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold">Mais Informações</h3>
            <p className="mt-4">
              Criado por{' '}
              <Link
                href="https://github.com/pachicodes"
                className="text-primary underline"
              >
                @pachicodes
              </Link>{' '}
              e mantido por colaboradores como{' '}
              <Link
                href="https://github.com/stephan-lopes"
                className="text-primary underline"
              >
                @stephan-lopes
              </Link>
              . O site foi desenvolvido inicialmente por{' '}
              <Link
                href="https://github.com/fabiobrasileiroo"
                className="text-primary underline"
              >
                @fabiobrasileiroo
              </Link>
              .
            </p>
          </div>
        </div>
        <LinksWithIcons />
        <div className="mt-8 text-center text-sm text-gray-400">
          Feito com 💚 por Eventos Tech Brasil
        </div>
      </div>
    </footer>
  )
}
