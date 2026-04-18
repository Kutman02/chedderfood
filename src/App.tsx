import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import type { ReactNode } from "react"

import { useAppSelector } from "./app/hooks"
import { useAuthInit } from "@/hooks/useAuthInit"

import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary"
import { ModalRedirectWrapper } from "./components/ModalRedirectWrapper"
import { Toast } from "./components/Toast/Toast"

import DashboardLayout from "./pages/dashboard/DashboardLayout"
import OrdersPage from "./pages/dashboard/orders/OrdersPage"
import ProductsPage from "./pages/dashboard/products/ProductsPage"
import CustomersPage from "./pages/dashboard/customers/CustomersPage"
import CategoriesPage from "./pages/dashboard/categories/CategoriesPage"
import TagsPage from "./pages/dashboard/tags/TagsPage"

import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import AboutUs from "./pages/AboutUs/AboutUs"
import Contacts from "./pages/Contacts/Contacts"
import CartPage from "./pages/Cart/CartPage"
import MyCheks from "./pages/MyCheks/MyCheks"

import AuthTest from "./components/AuthTest/AuthTest"
import WooCommerceTest from "./components/WooCommerceTest/WooCommerceTest"
import { StatsPage } from "./pages/dashboard/stats/StatsPage"
import ProfilePage from "./pages/dashboard/profile/pages/ProfilePage"

import NotFound from "./pages/NotFound"

// 🔐 НОРМАЛЬНЫЙ Protected Route
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAppSelector((s) => s.auth)

  // ❗ проверяем и token и user
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { isAuthChecked } = useAuthInit()

  // ⛔ пока не проверили auth — ничего не рендерим
  if (!isAuthChecked) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>
  }

  return (
    <ErrorBoundary>
      <Toast />

      <Router>
        <Routes>

          {/* Главная */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<Home />} />

          {/* Login */}
          <Route
            path="/login"
            element={
              <ModalRedirectWrapper>
                <Login />
              </ModalRedirectWrapper>
            }
          />

          {/* About */}
          <Route
            path="/about"
            element={
              <ModalRedirectWrapper>
                <AboutUs />
              </ModalRedirectWrapper>
            }
          />

          {/* Contacts */}
          <Route
            path="/contacts"
            element={
              <ModalRedirectWrapper>
                <Contacts />
              </ModalRedirectWrapper>
            }
          />

          {/* Модалки */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mycheks" element={<MyCheks />} />
          <Route path="/myreceipts" element={<Navigate to="/mycheks" replace />} />

          {/* Тесты */}
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/woo-test" element={<WooCommerceTest />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="orders" />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App