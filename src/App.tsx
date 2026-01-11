import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppSelector } from './app/hooks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ModalRedirectWrapper } from './components/ModalRedirectWrapper';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contacts from './pages/Contacts';
import AuthTest from './components/AuthTest';
import WooCommerceTest from './components/WooCommerceTest';
import NotFound from './pages/NotFound';

// Простая проверка: авторизован ли пользователь
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/login" />;
};

// Компонент для редиректа на главную с query параметром
const ModalRedirect = ({ modal }: { modal: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/?modal=${modal}`, { replace: true });
  }, [navigate, modal]);
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Публичный роут: Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Публичный роут: Вход */}
          <Route 
            path="/login" 
            element={
              <ModalRedirectWrapper>
                <Login />
              </ModalRedirectWrapper>
            } 
          />

          {/* Публичный роут: О нас */}
          <Route 
            path="/about" 
            element={
              <ModalRedirectWrapper>
                <AboutUs />
              </ModalRedirectWrapper>
            } 
          />

          {/* Публичный роут: Контакты */}
          <Route 
            path="/contacts" 
            element={
              <ModalRedirectWrapper>
                <Contacts />
              </ModalRedirectWrapper>
            } 
          />

          {/* Маршруты для модальных окон */}
          <Route path="/cart" element={<ModalRedirect modal="cart" />} />
          <Route path="/mycheks" element={<ModalRedirect modal="mycheks" />} />
          <Route path="/myreceipts" element={<ModalRedirect modal="mycheks" />} />

          {/* Тестовый роут: Проверка авторизации */}
          <Route path="/auth-test" element={<AuthTest />} />

          {/* Тестовый роут: Проверка WooCommerce API */}
          <Route path="/woo-test" element={<WooCommerceTest />} />

          {/* Приватный роут: Панель управления */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          {/* 404 страница - редирект на главную */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;