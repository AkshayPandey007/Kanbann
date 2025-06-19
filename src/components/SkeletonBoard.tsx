
const SkeletonCard = () => (
  <div className="bg-white rounded shadow p-4 mb-3 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const SkeletonColumn = ({ title }: { title: string }) => (
  <div className="bg-gray-100 p-3 rounded shadow min-h-[300px]">
    <h3 className="font-semibold mb-2 text-gray-400">{title}</h3>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

const SkeletonBoard = () => (
  <div className="grid grid-cols-3 gap-4">
    {['To Do', 'In Progress', 'Done'].map((col) => (
      <SkeletonColumn key={col} title={col} />
    ))}
  </div>
);

export default SkeletonBoard;
