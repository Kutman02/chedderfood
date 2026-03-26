import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import type { ReactNode } from "react"
import { useEffect } from "react"

import { useAppSelector } from "./app/hooks"

import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary"
import { ModalRedirectWrapper } from "./components/ModalRedirectWrapper"
import { Toast } from "./components/Toast/Toast"

import DashboardLayout from "./pages/dashboard/DashboardLayout"
import OrdersPage from "./pages/dashboard/orders/OrdersPage"
import ProductsPage from "./pages/dashboard/products/ProductsPage"
import CustomersPage from "./pages/dashboard/customers/CustomersPage"

import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import AboutUs from "./pages/AboutUs/AboutUs"
import Contacts from "./pages/Contacts/Contacts"

import AuthTest from "./components/AuthTest/AuthTest"
import WooCommerceTest from "./components/WooCommerceTest/WooCommerceTest"
import { StatsPage } from "./pages/dashboard/stats/StatsPage"
import ProfilePage from "./pages/dashboard/profile/pages/ProfilePage"



import NotFound from "./pages/NotFound"

// Проверка авторизации
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((s) => s.auth.token)

  return token ? children : <Navigate to="/login" replace />
}

// редирект на главную с query параметром
const ModalRedirect = ({ modal }: { modal: string }) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/?modal=${modal}`, { replace: true })
  }, [navigate, modal])

  return null
}

function App() {
  return (
    <ErrorBoundary>
      <Toast />

      <Router>
        <Routes>

          {/* Главная */}
          <Route path="/" element={<Home />} />

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
          <Route path="/cart" element={<ModalRedirect modal="cart" />} />
          <Route path="/mycheks" element={<ModalRedirect modal="mycheks" />} />
          <Route path="/myreceipts" element={<ModalRedirect modal="myreceipts" />} />

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