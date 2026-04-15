import { ProductsSection } from "../components/ProductsSection"
import { ProductSkeleton } from "@/components/Skeleton/components"
import { useEffect } from "react"

import { useProducts } from "../hooks/useProducts"
import { useOutletContext } from "react-router-dom"

type OutletContextType = {
  handleEditProduct: (product: any) => void
  setShowAddProductModal: (value: boolean) => void
  searchQuery: string
  setSearchMeta: (
    section: "orders" | "products" | "customers" | "categories" | "tags",
    meta: { found: number; total: number; loading?: boolean }
  ) => void
}

const ProductsPage = () => {

  const {
    handleEditProduct,
    setShowAddProductModal,
    searchQuery,
    setSearchMeta,
  } = useOutletContext<OutletContextType>()

  const {
    products,
    sortedProducts,
    totalProducts,
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

  useEffect(() => {
    setSearchMeta("products", {
      found: sortedProducts.length,
      total: totalProducts,
      loading: productsLoading,
    })
  }, [productsLoading, setSearchMeta, sortedProducts.length, totalProducts])

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
