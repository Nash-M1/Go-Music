export function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl animate-pulse">
      <div className="w-8 h-4 bg-zinc-800 rounded flex-shrink-0" />
      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-zinc-800 rounded-full w-48" />
        <div className="h-3 bg-zinc-800 rounded-full w-32" />
      </div>
      <div className="hidden md:block h-3 bg-zinc-800 rounded-full w-24" />
      <div className="h-3 bg-zinc-800 rounded-full w-8" />
    </div>
  )
}

export function SkeletonList({ count = 10 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <TrackSkeleton key={i} />
      ))}
    </div>
  )
}