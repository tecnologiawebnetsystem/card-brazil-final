import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PageLoading() {
  return (
    <div className="flex flex-col gap-7" aria-label="Carregando página" role="status">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-5 w-96 max-w-[70vw] rounded-lg" />
        </div>
        <Skeleton className="hidden h-11 w-36 rounded-lg sm:block" />
      </div>
      <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/60 bg-muted/25 px-6 py-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-52 rounded-lg" />
            <Skeleton className="h-4 w-72 max-w-[55vw] rounded-lg" />
          </div>
          <Skeleton className="h-11 w-36 rounded-lg" />
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex gap-4">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="hidden h-11 w-44 rounded-lg sm:block" />
          </div>
          <div className="overflow-hidden rounded-xl border border-border/70">
            <Skeleton className="h-12 w-full rounded-none" />
            <div className="flex flex-col gap-4 p-5">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
