import { ExternalLinkIcon, Github } from 'lucide-react'
function LinksWithIcons() {
  return (
    <div className="mt-6 flex flex-wrap justify-end gap-4">
      <a
        href="https://github.com/Abacatinhos/agenda-tech-brasil/blob/master/CONTRIBUTING.md"
        target="_blank"
        className="flex items-center gap-2 text-primary underline"
      >
        <ExternalLinkIcon size={18} />
        Contribuindo com eventos
      </a>
      <a
        href="https://github.com/Abacatinhos/agenda-tech-brasil?tab=readme-ov-file"
        target="_blank"
        className="flex items-center gap-2 text-primary underline"
      >
        <Github size={18} />
        Vem ver nosso github
      </a>
    </div>
  )
}

export default LinksWithIcons
