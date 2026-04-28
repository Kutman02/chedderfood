const TAB_SKELETON_WIDTHS = ["w-28", "w-40", "w-32", "w-20"]

export const OrderTabsSkeleton = () => {
  return (
    <div className="relative mb-4 overflow-x-auto">
      <div className="flex min-w-full w-max items-center gap-2 pr-1">
        {TAB_SKELETON_WIDTHS.map((widthClass, index) => (
          <div
            key={`order-tabs-skeleton-${index}`}
            className={`h-11 animate-pulse rounded-xl bg-slate-100 ${widthClass}`}
          />
        ))}
      </div>
    </div>
  )
}
