import type { ResultBlockProps } from "../types"

export const ResultBlock = ({ result }: ResultBlockProps) => {
  if (!result) return null

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Result:</h3>

      <pre className="text-sm overflow-auto bg-white p-3 rounded border">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}