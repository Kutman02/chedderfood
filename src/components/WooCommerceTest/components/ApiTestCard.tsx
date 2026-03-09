import type { ApiTestCardProps } from "../types"

export const ApiTestCard = ({
  title,
  loading,
  error,
  data,
  buttonText,
  color,
  onTest,
}: ApiTestCardProps) => {

  const buttonColor =
    color === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-green-600 hover:bg-green-700"

  const status = loading
    ? "Loading..."
    : error
    ? "Error"
    : data
    ? "Success"
    : "Idle"

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <button
        onClick={onTest}
        disabled={loading}
        className={`w-full text-white p-3 rounded-lg disabled:opacity-50 mb-3 ${buttonColor}`}
      >
        {loading ? "Loading..." : buttonText}
      </button>

      <div className="text-sm text-gray-600">
        Status: {status}
      </div>
    </div>
  )
}