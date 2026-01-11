import { Skeleton } from './Skeleton';

interface OrderSkeletonProps {
  count?: number;
}

export const OrderSkeleton = ({ count = 5 }: OrderSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-5 animate-in fade-in duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              {/* Номер заказа */}
              <Skeleton variant="rectangular" width={56} height={56} animation="pulse" className="rounded-xl" />
              
              <div>
                {/* Имя */}
                <Skeleton variant="text" width={150} height={20} animation="pulse" className="mb-2" />
                {/* Телефон */}
                <Skeleton variant="text" width={120} height={16} animation="pulse" />
              </div>
            </div>
            
            <div className="text-right">
              <Skeleton variant="text" width={60} height={12} animation="pulse" className="mb-1" />
              <Skeleton variant="text" width={80} height={20} animation="pulse" />
            </div>
          </div>

          {/* Адрес */}
          <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200">
            <Skeleton variant="text" width={100} height={12} animation="pulse" className="mb-2" />
            <Skeleton variant="text" width="100%" height={16} animation="pulse" />
          </div>

          {/* Кнопка просмотра */}
          <div className="mb-4">
            <Skeleton variant="rectangular" width="100%" height={40} animation="pulse" className="rounded-xl" />
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width="50%" height={44} animation="pulse" className="rounded-xl" />
            <Skeleton variant="rectangular" width="50%" height={44} animation="pulse" className="rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
};

