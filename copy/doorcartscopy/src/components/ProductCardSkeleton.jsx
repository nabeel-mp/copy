export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="h-32 bg-gray-100" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/4 mt-1" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}