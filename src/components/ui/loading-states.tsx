import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function DataTableSkeleton({ 
  columns = 4, 
  rows = 5, 
  className 
}: DataTableSkeletonProps) {
  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex items-center space-x-4 pb-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-20 ml-auto" />
      </div>
      <div className="rounded-2xl border border-white/5 bg-card/20 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-white/5 p-4 bg-white/5">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} className="h-10 flex-1 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatsSkeletonProps {
  count?: number;
  className?: string;
}

export function StatsSkeleton({ count = 4, className }: StatsSkeletonProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-[2.5rem]" />
      ))}
    </div>
  );
}

interface PageHeaderSkeletonProps {
  className?: string;
}

export function PageHeaderSkeleton({ className }: PageHeaderSkeletonProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12", className)}>
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-3xl" />
        <div className="space-y-3">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-64 h-12 md:h-16" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-14 w-40 rounded-xl" />
        <Skeleton className="h-14 w-40 rounded-xl" />
      </div>
    </div>
  );
}
