export default function AdminProductRowSkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="w-8 h-8 bg-gray-100 rounded-lg" />
    </div>
  );
}