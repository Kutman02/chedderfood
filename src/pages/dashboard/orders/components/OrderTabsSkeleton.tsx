import {
  ORDER_STATUS_TABS,
  ORDER_TAB_SKELETON_WIDTH_CLASSES,
} from "../orders.constants"

export const OrderTabsSkeleton = () => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {ORDER_STATUS_TABS.map((status) => (
        <div
          key={`order-tabs-skeleton-${status}`}
          className={`h-8 animate-pulse rounded-lg bg-slate-100 ${ORDER_TAB_SKELETON_WIDTH_CLASSES[status]}`}
        />
      ))}
    </div>
  )
}
