import { Header } from "../../components/Dashboard/Header/Header";

import { useDashboard } from "./hooks/useDashboard";


import { SectionsNav } from "./components/SectionsNav";
import { OrderTabs } from "./components/OrderTabs";
import { SearchBar } from "./components/SearchBar";
import { OrdersSection } from "./components/OrdersSection";
import { ProductsSection } from "./components/ProductsSection";
import { CustomersSection } from "./components/CustomersSection";

import { OrderDetailsModal } from "../../components/Dashboard/OrderDetailsModal/OrderDetailsModal";
import { AddProductModal } from "../../components/Dashboard/AddProductModal/AddProductModal";
import { EditProductModal } from "../../components/Dashboard/EditProductModal/EditProductModal";
import { StatsModal } from "../../components/Dashboard/Stats/StatsModal";

import { OrderSkeleton, ProductSkeleton } from "../../components/Skeleton/components";

import { isAuthenticationError } from "./utils/isAuthenticationError";

const Dashboard = () => {

  const {
    userName,
    authLoading,
    isAuthenticated,

    mainSection,
    setMainSection,

    activeTab,
    setActiveTab,

    searchQuery,
    setSearchQuery,

    orders,
    ordersLoading,
    ordersError,

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
    handleDrop,

    processingIds,
    removingOrderIds,

    expandedConfirmation,
    handleConfirmAction,
    handleConfirmStatusUpdate,

    handleViewDetails,

    handleEditProduct,

    showStats,
    setShowStats,

    showSettings,
    setShowSettings,

    showAddProductModal,
    setShowAddProductModal,

    showEditProductModal,
    setShowEditProductModal,

    selectedProduct,

    orderDetailsModal,
    setOrderDetailsModal,

    getPlaceholder

  } = useDashboard();


  // ❗ проверка авторизации
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-bold mb-4">
            Требуется авторизация
          </div>

          <div className="text-slate-600">
            Пожалуйста,
            <a
              href="/login"
              className="text-orange-600 hover:text-orange-700 underline ml-1"
            >
              войдите в систему
            </a>
          </div>
        </div>
      </div>
    );
  }

  const hasAuthError = ordersError;
  const isAuthErrorDetected =
    hasAuthError && isAuthenticationError(ordersError);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ошибка авторизации */}
      {isAuthErrorDetected && (
        <div className="bg-red-50 border-2 border-red-200 mx-4 mt-4 p-4 rounded-xl">
          <div className="font-bold text-red-800">
            Ошибка аутентификации
          </div>

          <div className="text-red-600 text-sm">
            Не удалось получить доступ к данным
          </div>
        </div>
      )}

      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showStats={showStats}
        setShowStats={setShowStats}
        userName={userName}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* навигация секций */}
        <SectionsNav
          mainSection={mainSection}
          setMainSection={setMainSection}
        />

        {/* поиск */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={getPlaceholder()}
        />

        {/* вкладки заказов */}
        {mainSection === "orders" && (
          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {/* контент */}
        <main className="mt-6 space-y-4">

          {mainSection === "orders" && (
            <>
              {ordersLoading ? (
                <OrderSkeleton count={5} />
              ) : (
                <OrdersSection
                  orders={orders}
                  activeTab={activeTab}
                  processingIds={processingIds}
                  removingOrderIds={removingOrderIds}
                  expandedConfirmation={expandedConfirmation}
                  onConfirmAction={handleConfirmAction}
                  onStatusUpdate={handleConfirmStatusUpdate}
                  onViewDetails={handleViewDetails}
                />
              )}
            </>
          )}

          {mainSection === "products" && (
            <>
              {productsLoading ? (
                <ProductSkeleton count={12} />
              ) : (
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
              )}
            </>
          )}

          {mainSection === "customers" && (
            <CustomersSection searchQuery={searchQuery} />
          )}

        </main>
      </div>

      {/* модалки */}

      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        order={orderDetailsModal.order}
        onClose={() =>
          setOrderDetailsModal({
            isOpen: false,
            order: null,
          })
        }
      />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />

      <EditProductModal
        isOpen={showEditProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowEditProductModal(false);
        }}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

    </div>
  );
};

export default Dashboard;