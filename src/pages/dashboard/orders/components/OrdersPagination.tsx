import type { Dispatch, SetStateAction } from "react"

type OrdersPaginationProps = {
  isDetailsOpen: boolean
  shouldPaginate: boolean
  totalPages: number
  page: number
  setPage: Dispatch<SetStateAction<number>>
}

export const OrdersPagination = ({
  isDetailsOpen,
  shouldPaginate,
  totalPages,
  page,
  setPage,
}: OrdersPaginationProps) => {
  if (isDetailsOpen || !shouldPaginate || totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 text-gray-600 disabled:opacity-50"
      >
        ← Назад
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((value) => {
          return value === 1 || value === totalPages || Math.abs(value - page) <= 1
        })
        .map((value, index, arr) => {
          const prev = arr[index - 1]

          return (
            <span key={value} className="flex items-center">
              {prev && value - prev > 1 && (
                <span className="px-2 text-gray-400">...</span>
              )}

              <button
                onClick={() => setPage(value)}
                className={`px-3 py-1 rounded ${
                  value === page
                    ? "bg-gray-200 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {value}
              </button>
            </span>
          )
        })}

      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 text-gray-600 disabled:opacity-50"
      >
        Вперёд →
      </button>
    </div>
  )
}
