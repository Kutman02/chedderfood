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
