import { FaDollarSign } from "react-icons/fa"

interface PriceFieldsProps {
  regularPrice: string
  setRegularPrice: (value: string) => void

  salePrice: string
  setSalePrice: (value: string) => void
}

export const PriceFields = ({
  regularPrice,
  setRegularPrice,
  salePrice,
  setSalePrice
}: PriceFieldsProps) => {

  return (

    <div className="grid grid-cols-2 gap-4">

      {/* REGULAR PRICE */}

      <div>

        <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
          <FaDollarSign />
          Цена (сом) *
        </label>

        <input
          type="number"
          value={regularPrice}
          onChange={(e) => setRegularPrice(e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
        />

      </div>


      {/* SALE PRICE */}

      <div>

        <label className="block text-sm font-black text-slate-700 mb-2">
          Цена со скидкой (сом)
        </label>

        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
        />

      </div>

    </div>

  )

}