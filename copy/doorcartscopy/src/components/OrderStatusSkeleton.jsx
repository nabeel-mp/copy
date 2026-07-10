export default function OrderStatusSkeleton() {
  return (
    <div className="pt-20 px-4 space-y-5 animate-pulse">
      {/* Order header card */}
      <div className="bg-gray-100 h-40 rounded-[28px]" />

      {/* Progress tracker */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="space-y-7">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item summary */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}