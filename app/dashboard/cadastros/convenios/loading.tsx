import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ConveniosLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-l-4 border-l-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <div key={j} className="space-y-1">
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
