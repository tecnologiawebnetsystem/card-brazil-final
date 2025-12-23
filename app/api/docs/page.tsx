"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })
import "swagger-ui-react/swagger-ui.css"

export default function ApiDocs() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando documentação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-foreground">CardBrazil CRM - API Documentation</h1>
          <p className="text-muted-foreground mt-2">Documentação completa da API REST do sistema CardBrazil CRM</p>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <SwaggerUI url="/api/swagger" docExpansion="list" defaultModelsExpandDepth={1} defaultModelExpandDepth={1} />
      </div>
    </div>
  )
}
