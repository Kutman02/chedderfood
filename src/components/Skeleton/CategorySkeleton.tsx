import { Skeleton } from './Skeleton';

interface CategorySkeletonProps {
  count?: number;
}

export const CategorySkeleton = ({ count = 8 }: CategorySkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={100}
          height={36}
          animation="pulse"
          className="rounded-lg shrink-0"
        />
      ))}
    </>
  );
};

