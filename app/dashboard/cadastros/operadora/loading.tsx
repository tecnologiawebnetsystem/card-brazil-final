export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64 mb-6"></div>
          <div className="h-32 bg-muted rounded mb-6"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
