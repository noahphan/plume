import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatesLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-4 w-48 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} padding="md">
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </GlassCard>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:w-96">
          <GlassCard padding="lg">
            <Skeleton className="h-40" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
