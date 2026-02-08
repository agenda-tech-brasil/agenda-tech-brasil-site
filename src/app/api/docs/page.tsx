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
  }
}

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'swagger' | 'scalar'>('swagger')
  const swaggerContainerRef = useRef<HTMLDivElement>(null)
  const scalarContainerRef = useRef<HTMLDivElement>(null)
  const [isSwaggerLoaded, setIsSwaggerLoaded] = useState(false)
  const [isScalarLoaded, setIsScalarLoaded] = useState(false)

  useEffect(() => {
    // Determinar a URL base correta
    const basePath =
      process.env.NODE_ENV === 'production' ? '/agenda-tech-brasil-site' : ''
    const openapiUrl = `${basePath}/openapi.json`

    // Track created elements for cleanup
    const createdElements: HTMLElement[] = []

    // Carregar Swagger UI
    const loadSwaggerUI = () => {
      // Add Swagger UI CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css'
      document.head.appendChild(link)
      createdElements.push(link)

      // Add custom CSS to override dark theme
      const style = document.createElement('style')
      style.textContent = `
        /* Force light theme for Swagger UI */
        .swagger-ui {
          background-color: #ffffff !important;
        }
        .swagger-ui .topbar {
          background-color: #f8f9fa !important;
        }
        .swagger-ui .info {
          background-color: #ffffff !important;
        }
        .swagger-ui .scheme-container {
          background-color: #f8f9fa !important;
        }
        .swagger-ui .opblock {
          background: #ffffff !important;
          border-color: #e5e7eb !important;
        }
        .swagger-ui .opblock .opblock-summary {
          background: #f9fafb !important;
        }
        .swagger-ui .btn {
          background: #3b82f6 !important;
          color: white !important;
        }
        .swagger-ui .model-box {
          background: #f9fafb !important;
        }
        .swagger-ui section.models {
          background: #ffffff !important;
        }
        .swagger-ui .model {
          background: #ffffff !important;
        }
        .swagger-ui table thead tr th {
          color: #1f2937 !important;
        }
        .swagger-ui .parameter__name,
        .swagger-ui .parameter__type,
        .swagger-ui .response-col_status,
        .swagger-ui .response-col_description {
          color: #1f2937 !important;
        }
        .swagger-ui .info .title,
        .swagger-ui .info h1,
        .swagger-ui .info h2,
        .swagger-ui .info h3,
        .swagger-ui .info h4,
        .swagger-ui .info h5 {
          color: #1f2937 !important;
        }
        .swagger-ui .markdown p,
        .swagger-ui .markdown code {
          color: #374151 !important;
        }
      `
      document.head.appendChild(style)
      createdElements.push(style)

      const script1 = document.createElement('script')
      script1.src =
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js'
      script1.async = true
      createdElements.push(script1)

      const script2 = document.createElement('script')
      script2.src =
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
      script2.async = true
      createdElements.push(script2)

      // Wait for both scripts to load before initializing
      let script1Loaded = false
      let script2Loaded = false

      const tryInitSwagger = () => {
        if (
          script1Loaded &&
          script2Loaded &&
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
          setIsSwaggerLoaded(true)
        }
      }

      script1.onload = () => {
        script1Loaded = true
        tryInitSwagger()
      }

      script2.onload = () => {
        script2Loaded = true
        tryInitSwagger()
      }

      document.body.appendChild(script1)
      document.body.appendChild(script2)
    }

    // Carregar Scalar usando Web Component
    const loadScalar = () => {
      // Scalar uses a web component, so we need to load it differently
      const script = document.createElement('script')
      script.id = 'api-reference'
      script.type = 'application/json'
      script.textContent = JSON.stringify({
        spec: {
          url: openapiUrl,
        },
      })
      document.body.appendChild(script)
      createdElements.push(script)

      const scalarScript = document.createElement('script')
      scalarScript.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
      scalarScript.async = true
      scalarScript.onload = () => {
        setIsScalarLoaded(true)
      }
      document.body.appendChild(scalarScript)
      createdElements.push(scalarScript)
    }

    loadSwaggerUI()
    loadScalar()

    return () => {
      // Cleanup: remove all created elements
      createdElements.forEach((element) => {
        element.parentNode?.removeChild(element)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Documentação da API - Agenda Tech Brasil
          </h1>
          <p className="text-gray-600">
            Explore e teste os endpoints da API de eventos técnicos
          </p>
        </div>

        {/* Tabs para alternar entre Swagger UI e Scalar */}
        <div className="mb-4">
          <div className="border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('swagger')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'swagger'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Swagger UI
              </button>
              <button
                onClick={() => setActiveTab('scalar')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'scalar'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Scalar
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator for Swagger */}
        {!isSwaggerLoaded && activeTab === 'swagger' && (
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
            <div className="text-center">
              <div className="mb-2 text-lg font-medium text-gray-900">
                Carregando documentação...
              </div>
              <div className="text-sm text-gray-500">
                Aguarde enquanto carregamos a interface do Swagger UI
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator for Scalar */}
        {!isScalarLoaded && activeTab === 'scalar' && (
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
            <div className="text-center">
              <div className="mb-2 text-lg font-medium text-gray-900">
                Carregando documentação...
              </div>
              <div className="text-sm text-gray-500">
                Aguarde enquanto carregamos a interface do Scalar
              </div>
            </div>
          </div>
        )}

        {/* Swagger UI Container */}
        <div
          id="swagger-ui"
          className="rounded-lg border border-gray-200 bg-white"
          style={{ display: activeTab === 'swagger' ? 'block' : 'none' }}
        >
          <div id="swagger-container" ref={swaggerContainerRef}></div>
        </div>

        {/* Scalar UI Container */}
        <div
          id="scalar-ui"
          className="rounded-lg border border-gray-200 bg-white"
          style={{
            display: activeTab === 'scalar' ? 'block' : 'none',
            minHeight: '600px',
          }}
        >
          <div ref={scalarContainerRef}>
            {isScalarLoaded && <div id="api-reference-container"></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
