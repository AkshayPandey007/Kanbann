
const TaskCardSkeleton = () => {
  return (
    <div className="bg-white p-4 mb-3 rounded shadow animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-full" />
      <div className="h-3 bg-gray-300 rounded w-2/3" />
      <div className="h-6 w-20 bg-gray-300 rounded" />
    </div>
  );
};

export default TaskCardSkeleton;
