export default function AdminStatCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="w-6 h-6 bg-gray-100 rounded mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-5 bg-gray-100 rounded w-2/3" />
    </div>
  );
}