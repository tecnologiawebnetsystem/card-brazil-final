"use client"

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export function SwaggerDocumentation() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-sidebar px-6 py-5 text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-accent">Card Brazil</p>
          <h1 className="text-2xl font-semibold tracking-tight">Documentação da API</h1>
          <p className="max-w-2xl text-sm text-sidebar-foreground/70">
            Explore os endpoints, schemas, parâmetros e respostas disponíveis para integração com o sistema.
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <SwaggerUI
            url="/api/swagger"
            docExpansion="list"
            defaultModelsExpandDepth={1}
            displayRequestDuration
            filter
            persistAuthorization
            tryItOutEnabled
          />
        </div>
      </section>
    </main>
  )
}
