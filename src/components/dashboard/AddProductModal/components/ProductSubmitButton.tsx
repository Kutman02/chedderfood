type ProductSubmitButtonProps = {
  isSubmitting: boolean
  disabled: boolean
  onSubmit: () => void
}

export const ProductSubmitButton = ({
  isSubmitting,
  disabled,
  onSubmit,
}: ProductSubmitButtonProps) => {
  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={disabled}
      className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 md:py-3 rounded-xl font-black text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 md:mt-6 active:scale-95"
    >
      {isSubmitting ? "Публикация..." : "Опубликовать"}
    </button>
  )
}
