export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Gallery */}
      <div className="h-[350px] bg-gray-100 border-b border-gray-100" />

      {/* Info card */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-t-[32px] p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-gray-50">
          <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
          <div className="h-8 bg-gray-100 rounded w-1/2 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-6" />

          <div className="grid grid-cols-3 gap-3 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-2xl h-20 border border-gray-100" />
            ))}
          </div>

          <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
          <div className="h-11 bg-gray-100 rounded-xl w-32 mb-8" />

          <div className="h-16 bg-gray-100 rounded-2xl mb-8" />

          <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}   