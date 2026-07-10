export default function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden animate-pulse">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-100" />
      <div className="flex justify-between items-start pl-2">
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-32" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
        <div className="h-5 bg-gray-100 rounded w-16" />
      </div>
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 pl-2">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}