import { Skeleton } from "@/components/ui/skeleton"

export default function SobreLoading() {
  return (
    <div className="container-responsive py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>

      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
