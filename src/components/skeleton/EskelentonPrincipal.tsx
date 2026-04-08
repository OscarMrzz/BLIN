import { Skeleton } from "@/components/misUI/skeleton";

function RutaItemSkeleton() {
  return (
    <div className="w-full  h-120 bg-white shadow-lg rounded-2xl flex flex-col justify-between  ">
      <div className="p-4">
        <Skeleton className="h-60 w-full bg-slate-300/50" />
      </div>

      <div className="p-4">
        <p className="w-full bg-slate-300/50 h-4 mb-2"></p>
        <p className="w-full bg-slate-300/50 h-4"></p>
      </div>
      <div className="p-4">
        <p className="w-full bg-slate-300/50 h-8"></p>
      </div>
     
    </div>
  );
}

export function SkeletonPrincipal() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 ">
      {Array.from({ length: 7 }).map((_, i) => (
        <RutaItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function EskelentonTabla() {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table rows skeleton */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 border-b">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/25"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* Table footer skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EskelentonFormulario() {
  return (
    <div className="space-y-6 p-6">
      {/* Form header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Form fields skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Form actions skeleton */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function EskelentonTarjeta() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      {/* Card header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Card content */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Card actions */}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
