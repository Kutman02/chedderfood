const PRIMARY_TAB_SKELETON_WIDTHS = ["w-24", "w-36", "w-28"]
const MORE_TAB_SKELETON_WIDTH = "w-16"

export const OrderTabsSkeleton = () => {
  return (
    <div className="relative mb-4 overflow-x-auto">
      <div className="flex min-w-full w-max items-center gap-2 pr-1">
        <div className="sticky left-0 z-10 flex shrink-0 items-center gap-2 bg-white pr-2">
          {PRIMARY_TAB_SKELETON_WIDTHS.map((widthClass, index) => (
            <div
              key={`order-tabs-skeleton-primary-${index}`}
              className={`h-8 animate-pulse rounded-lg bg-slate-100 ${widthClass}`}
            />
          ))}
        </div>

        <div
          className={`h-8 animate-pulse rounded-lg bg-slate-100 ${MORE_TAB_SKELETON_WIDTH}`}
        />
      </div>
    </div>
  )
}
