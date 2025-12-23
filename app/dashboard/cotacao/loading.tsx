export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64 mb-6"></div>

          {/* Métricas skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>

          {/* Filtros skeleton */}
          <div className="h-32 bg-muted rounded mb-6"></div>

          {/* Tabela skeleton */}
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
