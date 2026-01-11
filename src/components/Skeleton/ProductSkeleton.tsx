import { Skeleton } from './Skeleton';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton = ({ count = 8 }: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="shadow-lg overflow-hidden flex flex-col animate-in fade-in duration-300"
        >
          {/* Изображение товара */}
          <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-2xl shadow-md">
            <Skeleton variant="rectangular" className="w-full h-full" animation="pulse" />
          </div>

          {/* Контент карточки */}
          <div className="p-3">
            {/* Цена */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton variant="text" width={80} height={24} animation="pulse" />
              <Skeleton variant="text" width={60} height={16} animation="pulse" />
            </div>

            {/* Название */}
            <div className="mb-2">
              <Skeleton variant="text" width="100%" height={16} animation="pulse" className="mb-1" />
              <Skeleton variant="text" width="70%" height={16} animation="pulse" />
            </div>

            {/* Теги */}
            <div className="flex flex-wrap gap-1 mb-2">
              <Skeleton variant="rectangular" width={60} height={20} animation="pulse" className="rounded-full" />
              <Skeleton variant="rectangular" width={70} height={20} animation="pulse" className="rounded-full" />
            </div>

            {/* Мета-данные */}
            <div className="flex items-center gap-2">
              <Skeleton variant="text" width={50} height={12} animation="pulse" />
              <Skeleton variant="text" width={80} height={12} animation="pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

