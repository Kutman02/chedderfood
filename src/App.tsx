import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from './app/hooks';
import { ErrorBoundary } from './components/ErrorBoundary';
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Публичный роут: Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Публичный роут: Вход */}
          <Route path="/login" element={<Login />} />

          {/* Публичный роут: О нас */}
          <Route path="/about" element={<AboutUs />} />

          {/* Публичный роут: Контакты */}
          <Route path="/contacts" element={<Contacts />} />

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