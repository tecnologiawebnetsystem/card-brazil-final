export default function AgenciadorLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-4">
              <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
