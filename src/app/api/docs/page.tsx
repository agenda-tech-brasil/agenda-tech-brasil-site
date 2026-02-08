'use client'

import { useEffect, useRef, useState } from 'react'

// Extend window type for external libraries
declare global {
  interface Window {
    SwaggerUIBundle?: {
      (options: Record<string, unknown>): unknown
      presets: {
        apis: unknown
      }
      plugins: {
        DownloadUrl: unknown
      }
    }
    SwaggerUIStandalonePreset?: unknown
    ui?: unknown
    ApiReference?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => void
    }
  }
}

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'swagger' | 'scalar'>('swagger')
  const swaggerContainerRef = useRef<HTMLDivElement>(null)
  const scalarContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Determinar a URL base correta
    const basePath =
      process.env.NODE_ENV === 'production' ? '/agenda-tech-brasil-site' : ''
    const openapiUrl = `${basePath}/openapi.json`

    // Carregar Swagger UI
    const loadSwaggerUI = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css'
      document.head.appendChild(link)

      const script1 = document.createElement('script')
      script1.src =
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js'
      script1.async = true

      const script2 = document.createElement('script')
      script2.src =
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
      script2.async = true

      script2.onload = () => {
        if (
          typeof window !== 'undefined' &&
          window.SwaggerUIBundle &&
          swaggerContainerRef.current
        ) {
          window.ui = window.SwaggerUIBundle({
            url: openapiUrl,
            dom_id: '#swagger-container',
            deepLinking: true,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIStandalonePreset,
            ],
            plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
            layout: 'StandaloneLayout',
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
            displayRequestDuration: true,
            filter: true,
            tryItOutEnabled: true,
          })
          setIsLoaded(true)
        }
      }

      document.body.appendChild(script1)
      document.body.appendChild(script2)
    }

    // Carregar Scalar
    const loadScalar = () => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
      script.async = true

      script.onload = () => {
        setTimeout(() => {
          if (
            typeof window !== 'undefined' &&
            window.ApiReference &&
            scalarContainerRef.current
          ) {
            window.ApiReference.render(scalarContainerRef.current, {
              spec: {
                url: openapiUrl,
              },
              theme: 'default',
              showSidebar: true,
            })
          }
        }, 500)
      }

      document.body.appendChild(script)
    }

    loadSwaggerUI()
    loadScalar()

    return () => {
      // Cleanup scripts if needed
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            Documentação da API - Agenda Tech Brasil
          </h1>
          <p className="text-muted-foreground">
            Explore e teste os endpoints da API de eventos técnicos
          </p>
        </div>

        {/* Tabs para alternar entre Swagger UI e Scalar */}
        <div className="mb-4">
          <div className="border-b border-border">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('swagger')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'swagger'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Swagger UI
              </button>
              <button
                onClick={() => setActiveTab('scalar')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'scalar'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Scalar
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {!isLoaded && activeTab === 'swagger' && (
          <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
            <div className="text-center">
              <div className="mb-2 text-lg font-medium">
                Carregando documentação...
              </div>
              <div className="text-sm text-muted-foreground">
                Aguarde enquanto carregamos a interface do Swagger UI
              </div>
            </div>
          </div>
        )}

        {/* Swagger UI Container */}
        <div
          id="swagger-ui"
          className="rounded-lg border border-border bg-card"
          style={{ display: activeTab === 'swagger' ? 'block' : 'none' }}
        >
          <div id="swagger-container" ref={swaggerContainerRef}></div>
        </div>

        {/* Scalar UI Container */}
        <div
          id="scalar-ui"
          className="rounded-lg border border-border bg-card"
          style={{ display: activeTab === 'scalar' ? 'block' : 'none' }}
        >
          <div ref={scalarContainerRef}></div>
        </div>
      </div>
    </div>
  )
}
