import { FaUser, FaPhone, FaMapMarkerAlt, FaTimes } from "react-icons/fa"

interface CustomerData {
  first_name: string
  phone: string
  address: string
}

interface CustomerDataCardProps {
  customerData: CustomerData | null
  onUse?: () => void
  onClear: () => void
}

export const CustomerDataCard = ({
  customerData,
  onUse,
  onClear
}: CustomerDataCardProps) => {

  if (!customerData) {
    return (
      <div>

        <p>
          Сохраненные данные отсутствуют
        </p>

        <p>
          После первого заказа данные сохранятся автоматически
        </p>

      </div>
    )
  }

  return (

    <div>

      <div>

        {/* Имя */}
        <div>

          <FaUser size={14} />

          <span>
            {customerData.first_name}
          </span>

        </div>

        {/* Телефон */}
        <div>

          <FaPhone size={14} />

          <span>
            {customerData.phone}
          </span>

        </div>

        {/* Адрес */}
        <div>

          <FaMapMarkerAlt size={14} />

          <span>
            {customerData.address}
          </span>

        </div>

      </div>

      {/* Кнопки */}
      <div>

        {onUse && (
          <button onClick={onUse}>
            Использовать
          </button>
        )}

        <button
          onClick={onClear}
          title="Очистить данные"
        >
          <FaTimes size={16} />
        </button>

      </div>

    </div>

  )

}