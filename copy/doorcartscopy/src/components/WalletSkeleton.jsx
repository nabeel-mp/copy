export default function WalletSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 relative animate-pulse">
      <div className="mt-5 bg-gray-200 rounded-3xl h-56" />

      <div className="mt-8">
        <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-3xl h-20" />
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="h-5 bg-gray-100 rounded w-1/3 mb-1" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-50 h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}