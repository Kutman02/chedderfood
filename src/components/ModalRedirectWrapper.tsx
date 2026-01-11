import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ModalRedirectWrapperProps {
  children: ReactNode;
}

/**
 * Компонент-обертка для перехвата modal параметров на всех страницах
 * и редиректа на главную страницу с открытием соответствующего модального окна
 */
export const ModalRedirectWrapper = ({ children }: ModalRedirectWrapperProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const modal = searchParams.get('modal');
    
    // Если есть modal параметр и мы не на главной странице, редиректим на главную
    if (modal && location.pathname !== '/') {
      const productId = searchParams.get('productId');
      const params = new URLSearchParams();
      params.set('modal', modal);
      if (productId) {
        params.set('productId', productId);
      }
      navigate(`/?${params.toString()}`, { replace: true });
    }
  }, [location.pathname, searchParams, navigate]);
  
  return <>{children}</>;
};

