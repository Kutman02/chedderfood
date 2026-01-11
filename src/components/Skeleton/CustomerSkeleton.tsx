import { Skeleton } from './Skeleton';

interface CustomerSkeletonProps {
  count?: number;
}

export const CustomerSkeleton = ({ count = 6 }: CustomerSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-5 animate-in fade-in duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Аватар */}
              <Skeleton variant="rectangular" width={56} height={56} animation="pulse" className="rounded-xl" />
              
              {/* Имя */}
              <div>
                <Skeleton variant="text" width={150} height={20} animation="pulse" />
              </div>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={16} height={16} animation="pulse" />
              <Skeleton variant="text" width={120} height={16} animation="pulse" />
            </div>
            <div>
              <Skeleton variant="text" width="80%" height={16} animation="pulse" className="mb-1" />
              <Skeleton variant="text" width="60%" height={12} animation="pulse" />
            </div>
          </div>

          {/* Статистика */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <div className="flex-1 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton variant="circular" width={14} height={14} animation="pulse" />
                <Skeleton variant="text" width={60} height={12} animation="pulse" />
              </div>
              <Skeleton variant="text" width={40} height={20} animation="pulse" />
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton variant="circular" width={14} height={14} animation="pulse" />
                <Skeleton variant="text" width={70} height={12} animation="pulse" />
              </div>
              <Skeleton variant="text" width={60} height={20} animation="pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

