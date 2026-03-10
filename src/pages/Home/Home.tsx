import { PublicHeader } from "../../components/PublicHeader/PublicHeader"
import { PublicFooter } from "../../components/PublicFooter/PublicFooter"
import { Cart } from "../../components/Cart/Cart"
import { ProductModalSwipe } from "../../components/ProductModalSwipe/ProductModalSwipe"
import { MyReceipts } from "../../components/MyReceipts/MyReceipts"

import { CategorySection } from "./components/CategorySection"
import { FloatingCartButton } from "./components/FloatingCartButton"

import { useHomeLogic } from "./hooks/useHomeLogic"

import type { Category } from "@/types"

const Home = () => {
  const {
    products,
    categories,
    productsByCategory,
    productsLoading,
    categoriesLoading,

    cartCount,
    isCartOpen,
    isReceiptsOpen,

    selectedProduct,
    isModalOpen,

    openProductModal,
    closeProductModal,

    closeReceipts,
  } = useHomeLogic()

  const isLoading = categoriesLoading || productsLoading

  const filteredCategories =
    (categories as Category[])?.filter(
      (c: Category) => c.name !== "Без категории"
    ) || []

  return (
    <div className="min-h-screen flex flex-col transition-opacity duration-300">
      <PublicHeader />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center py-20 text-slate-400">
              Загрузка...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Категории не найдены
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  products={productsByCategory[category.id] || []}
                  onProductClick={openProductModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <FloatingCartButton cartCount={cartCount} />

      <PublicFooter />

      <ProductModalSwipe
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      {isReceiptsOpen && (
        <MyReceipts products={products || []} onClose={closeReceipts} />
      )}

      {isCartOpen && <Cart />}
    </div>
  )
}

export default Home