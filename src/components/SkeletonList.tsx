import { Skeleton } from "@/components/ui/skeleton";

const SkeletonList = () => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <div className="relative">
        <div className="flex flex-col gap-8 opacity-20">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonList;
