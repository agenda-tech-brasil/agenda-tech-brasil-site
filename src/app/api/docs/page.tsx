'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
      <div className="text-center">
        <div className="mb-2 text-lg font-medium text-gray-900">
          Carregando Swagger UI...
        </div>
        <div className="text-sm text-gray-500">
          Aguarde enquanto carregamos a interface
        </div>
      </div>
    </div>
  ),
})

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<'swagger' | 'scalar'>('swagger')

  const basePath =
    process.env.NODE_ENV === 'production' ? '/agenda-tech-brasil-site' : ''
  const openapiUrl = `${basePath}/openapi.json`

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
                className={`px-4 py-2 font-medium ${activeTab === 'swagger'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Swagger UI
              </button>
              <button
                onClick={() => setActiveTab('scalar')}
                className={`px-4 py-2 font-medium ${activeTab === 'scalar'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Scalar
              </button>
            </div>
          </div>
        </div>

        {/* Swagger UI Container */}
        <div
          className="rounded-lg border border-gray-200 bg-white"
          style={{ display: activeTab === 'swagger' ? 'block' : 'none' }}
        >
          <SwaggerUI
            url={openapiUrl}
            deepLinking
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            displayRequestDuration
            filter
            tryItOutEnabled
          />
        </div>

        {/* Scalar UI Container */}
        <div
          className="rounded-lg border border-gray-200 bg-white"
          style={{
            display: activeTab === 'scalar' ? 'block' : 'none',
            minHeight: '600px',
          }}
        >
          {activeTab === 'scalar' && (
            <ApiReferenceReact
              configuration={{
                url: openapiUrl,
                theme: 'default',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
