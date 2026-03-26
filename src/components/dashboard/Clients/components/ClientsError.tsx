import { FaUsers } from "react-icons/fa"

export const ClientsError = () => {

  return (

    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">

      <FaUsers className="text-4xl text-red-400 mx-auto mb-4"/>

      <p className="text-red-600 font-bold mb-2">
        Ошибка загрузки клиентов
      </p>

      <p className="text-red-500 text-sm">
        Не удалось получить список клиентов. Проверьте подключение к API.
      </p>

    </div>

  )

}