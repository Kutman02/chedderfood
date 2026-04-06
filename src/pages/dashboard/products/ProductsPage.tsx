import { ProductsSection } from "../components/ProductsSection"
import { ProductSkeleton } from "@/components/Skeleton/components"

import { useProducts } from "../hooks/useProducts"
import { useOutletContext } from "react-router-dom"

type OutletContextType = {
  handleEditProduct: (product: any) => void
  setShowAddProductModal: (value: boolean) => void
  searchQuery: string
}

const ProductsPage = () => {

  const {
    handleEditProduct,
    setShowAddProductModal,
    searchQuery
  } = useOutletContext<OutletContextType>()

  const {
    products,
    sortedProducts,
    productsLoading,
    productsError,

    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,

    selectedStatusFilter,
    setSelectedStatusFilter,

    draggedProductId,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useProducts(searchQuery)

  if (productsError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-semibold">Ошибка загрузки продуктов</p>
        <p className="text-slate-400 text-sm mt-2">Пожалуйста, попробуйте позже</p>
      </div>
    )
  }

  if (productsLoading) {
    return <ProductSkeleton count={12} />
  }

  return (
    <ProductsSection
      products={products}
      sortedProducts={sortedProducts}
      categories={categories}
      selectedCategoryFilter={selectedCategoryFilter}
      setSelectedCategoryFilter={setSelectedCategoryFilter}
      selectedStatusFilter={selectedStatusFilter}
      setSelectedStatusFilter={setSelectedStatusFilter}
      onAddProduct={() => setShowAddProductModal(true)}
      onEditProduct={handleEditProduct}
      draggedProductId={draggedProductId}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  )
}

export default ProductsPage
