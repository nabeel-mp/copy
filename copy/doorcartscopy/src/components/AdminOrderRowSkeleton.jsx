export default function AdminOrderRowSkeleton() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="h-7 bg-gray-100 rounded-lg w-24" />
    </div>
  );
}