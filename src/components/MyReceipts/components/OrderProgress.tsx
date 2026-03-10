interface OrderProgressProps {
  status: string
}

const steps = [
  { key: "pending", label: "Принят" },
  { key: "processing", label: "Готовится" },
  { key: "ready", label: "Готов" },
  { key: "completed", label: "Завершён" }
]

export const OrderProgress = ({ status }: OrderProgressProps) => {

  const currentIndex = steps.findIndex(step => step.key === status)

  return (
    <div className="w-full mt-2">

      <div className="flex items-center justify-between relative">

        {/* линия */}
        <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded" />

        {steps.map((step, index) => {

          const active = index <= currentIndex

          return (
            <div
              key={step.key}
              className="relative flex flex-col items-center z-10"
            >

              <div
                className={`
                  w-6
                  h-6
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center
                  text-xs
                  transition
                  ${active
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                  }
                `}
              >
                {index + 1}
              </div>

              <span className="text-[10px] mt-1 text-gray-500">
                {step.label}
              </span>

            </div>
          )
        })}
      </div>

    </div>
  )
}