import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 bg-yellow-400/10" />
              <Skeleton className="h-4 w-4 bg-yellow-400/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1 bg-yellow-400/10" />
              <Skeleton className="h-3 w-32 bg-yellow-400/10" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2 bg-yellow-400/10" />
              <Skeleton className="h-4 w-48 bg-yellow-400/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full bg-yellow-400/10" />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Card className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2 bg-yellow-400/10" />
              <Skeleton className="h-4 w-48 bg-yellow-400/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full bg-yellow-400/10" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analytics Rows */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20"
          >
            <CardHeader>
              <Skeleton className="h-5 w-24 bg-yellow-400/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full bg-yellow-400/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DataTableSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in-50">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px] bg-yellow-400/10" />
        <Skeleton className="h-10 w-[100px] bg-yellow-400/10" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border border-yellow-400/20 bg-black/50">
        <div className="h-12 border-b border-yellow-400/20 px-4 flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4 w-full mr-4 last:mr-0 bg-yellow-400/10"
            />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-yellow-400/10 px-4 flex items-center last:border-0"
          >
            <Skeleton className="h-4 w-[30%] mr-4 bg-yellow-400/5" />
            <Skeleton className="h-4 w-[20%] mr-4 bg-yellow-400/5" />
            <Skeleton className="h-4 w-[20%] mr-4 bg-yellow-400/5" />
            <Skeleton className="h-4 w-[15%] mr-4 bg-yellow-400/5" />
            <Skeleton className="h-4 w-[15%] bg-yellow-400/5" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-8 w-20 bg-yellow-400/10" />
        <Skeleton className="h-8 w-20 bg-yellow-400/10" />
      </div>
    </div>
  );
}

export function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar Skeleton - visible on md screens */}
      <div className="hidden border-r bg-muted/10 md:block w-64 shrink-0 h-full">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-yellow-400/10 px-6">
            <Skeleton className="h-6 w-32 bg-yellow-400/10" />
          </div>
          <div className="flex-1 px-4 py-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-9 w-full rounded-md bg-yellow-400/5"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-yellow-400/10 bg-background px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-md bg-yellow-400/10 md:hidden" />
            <Skeleton className="h-5 w-32 bg-yellow-400/10" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24 rounded-full bg-yellow-400/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-yellow-400/10" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto w-full max-w-7xl space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-yellow-400/10" />
              <Skeleton className="h-4 w-96 max-w-full bg-yellow-400/5" />
            </div>

            {/* Content Placeholder */}
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-32 rounded-xl bg-yellow-400/5 border border-yellow-400/10"
                  />
                ))}
              </div>
              <Skeleton className="h-[400px] w-full rounded-xl border border-yellow-400/10 bg-yellow-400/5" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div>
        <Skeleton className="h-9 w-64 mb-2 bg-yellow-400/10" />
        <Skeleton className="h-5 w-96 bg-yellow-400/5" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20"
          >
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2 bg-yellow-400/10" />
              <Skeleton className="h-6 w-32 bg-yellow-400/10" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-linear-to-br from-gray-900 to-black border-yellow-400/20">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-yellow-400/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full bg-yellow-400/5" />
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-8 w-64 mb-4 bg-yellow-400/10" />
        <div className="rounded-md border border-yellow-400/20 bg-black/50">
          <div className="h-12 border-b border-yellow-400/20 px-4 flex items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-full mr-4 last:mr-0 bg-yellow-400/10"
              />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 border-b border-yellow-400/10 px-4 flex items-center last:border-0"
            >
              <Skeleton className="h-4 w-full mr-4 bg-yellow-400/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
