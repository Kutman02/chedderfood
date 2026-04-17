import { PublicHeader } from "../../components/PublicHeader/PublicHeader"
import { PublicFooter } from "../../components/PublicFooter/PublicFooter"
import { Cart } from "../../components/Cart/Cart"
import { ProductModalSwipe } from "../../components/ProductModalSwipe/ProductModalSwipe"
import { MyReceipts } from "../../components/MyReceipts/MyReceipts"

import { CategorySection } from "./components/CategorySection"
import { FloatingCartButton } from "./components/FloatingCartButton"

import { useHomeLogic } from "./hooks/useHomeLogic"

const Home = () => {
  const {
    categories,
    products,
    productsByCategory,
    productsLoading,
    productsError,
    categoriesLoading,
    categoriesError,

    cartCount,
  cartTotalAmount,
    isCartOpen,
    isReceiptsOpen,

    selectedProduct,
    isModalOpen,

    openProductModal,
    closeProductModal,

    closeReceipts,
  } = useHomeLogic()

  /* =========================
     LOADING
  ========================= */

  const isLoading = productsLoading || categoriesLoading

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen flex flex-col transition-opacity duration-300">
      <PublicHeader />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center py-20 text-slate-400">
              Загрузка...
            </div>
          ) : productsError || categoriesError ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-semibold">Ошибка при загрузке данных</p>
              <p className="text-slate-400 text-sm mt-2">Пожалуйста, попробуйте позже</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Категории не найдены
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => (
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

      <FloatingCartButton cartCount={cartCount} totalAmount={cartTotalAmount} />

      <PublicFooter />

      <ProductModalSwipe
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      {isReceiptsOpen && (
        <MyReceipts products={products} onClose={closeReceipts} />
      )}

      {isCartOpen && <Cart />}
    </div>
  )
}

export default Home