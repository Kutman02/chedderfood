type ComboItemsEditorProps = {
  isCombo: boolean
  onToggleCombo: () => void
  comboItems: string[]
  onComboItemChange: (index: number, value: string) => void
  onComboItemRemove: (index: number) => void
  onComboItemAdd: () => void
}

export const ComboItemsEditor = ({
  isCombo,
  onToggleCombo,
  comboItems,
  onComboItemChange,
  onComboItemRemove,
  onComboItemAdd,
}: ComboItemsEditorProps) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <input
          aria-label="Отметьте, если товар является комбо"
          type="checkbox"
          checked={isCombo}
          onChange={onToggleCombo}
          className="w-5 h-5"
        />

        <span className="font-semibold text-slate-700">Это комбо</span>
      </div>

      {isCombo && (
        <div>
          <label className="text-sm font-black text-slate-700 mb-2">
            Состав комбо
          </label>

          <div className="space-y-2">
            {comboItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) => onComboItemChange(index, event.target.value)}
                  placeholder="Например: Бургер"
                  className="flex-1 p-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 outline-none"
                />

                {comboItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onComboItemRemove(index)}
                    className="px-3 bg-red-500 text-white rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={onComboItemAdd}
              className="text-orange-600 font-semibold pt-1"
            >
              + Добавить пункт
            </button>
          </div>
        </div>
      )}
    </>
  )
}
