import type { ErrorBlockProps } from "../types"

export const ErrorBlock = ({ title, error }: ErrorBlockProps) => {
  if (!error) return null

  return (
    <div className="mt-6 p-4 bg-red-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-red-800">
        {title}
      </h3>

      <pre className="text-sm overflow-auto bg-white p-3 rounded border text-red-600">
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  )
}