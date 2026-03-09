interface Props {
  onReload: () => void
}

export const ErrorFallback = ({ onReload }: Props) => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="text-center">

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Что-то пошло не так
        </h1>

        <p className="text-slate-600 mb-6">
          Произошла ошибка при загрузке страницы.
          Пожалуйста попробуйте обновить страницу.
        </p>

        <button
          onClick={onReload}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
        >
          Обновить страницу
        </button>

      </div>

    </div>

  )

}