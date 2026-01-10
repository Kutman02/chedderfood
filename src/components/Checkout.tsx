import React, { useState } from 'react';
import { FaTimes, FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaNotesMedical, FaShoppingBag } from 'react-icons/fa';
import { useCreateOrderMutation, useGetProductsQuery } from '../app/services/api';
import type { Product, CheckoutFormData } from '../types/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addReceipt, setCustomerData } from '../app/slices/receiptsSlice';

interface CheckoutProps {
  onClose: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  onClose,
  onBack,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);
  const savedCustomerData = useAppSelector((s) => s.receipts.customerData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const { data: products } = useGetProductsQuery({
    per_page: 100,
    status: 'publish',
  });

  const [formData, setFormData] = useState<CheckoutFormData>(() => ({
    first_name: savedCustomerData?.first_name || '',
    address: savedCustomerData?.address || '',
    phone: savedCustomerData?.phone || '',
    customer_note: '',
  }));

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  // Получаем товары в корзине
  const cartItems = products
    ? products
        .filter((product: Product) => cart[product.id] > 0)
        .map((product: Product) => ({
          product_id: product.id,
          quantity: cart[product.id],
        }))
    : [];

  // Расчет общей суммы
  const totalAmount = products
    ? products
        .filter((product: Product) => cart[product.id] > 0)
        .reduce((sum: number, product: Product) => {
          const price = parseFloat(product.sale_price || product.price || '0');
          return sum + (price * cart[product.id]);
        }, 0)
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Введите имя';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/[\d\s\-+()]+/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = () => {
    if (savedCustomerData) {
      setFormData(prev => ({
        ...prev,
        first_name: savedCustomerData.first_name,
        address: savedCustomerData.address,
        phone: savedCustomerData.phone,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        status: 'on-hold',
        customer_id: 0, // Гость
        billing: {
          first_name: formData.first_name,
          address_1: formData.address,
          phone: formData.phone,
          email: `customer_${Date.now()}@example.com`, // Временный email
        },
        shipping: {
          first_name: formData.first_name,
          address_1: formData.address,
        },
        line_items: cartItems,
        customer_note: formData.customer_note,
        total: totalAmount.toString(),
        currency: 'KGS',
      };

      console.log('Creating order with data:', orderData);
      const orderResponse = await createOrder(orderData).unwrap();
      console.log('Order created successfully:', orderResponse);
      
      dispatch(addReceipt(orderResponse));
      
      // Сохраняем данные клиента для автозаполнения
      dispatch(setCustomerData({
        first_name: formData.first_name,
        address: formData.address,
        phone: formData.phone,
      }));
      
      // Успешное создание заказа - закрываем все и возвращаем в корзину
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <FaShoppingBag className="text-orange-600 animate-pulse" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Создание заказа...</h3>
          <p className="text-slate-600 text-lg">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Кнопка закрытия вверху справа */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 ease-out active:scale-95"
      >
        <FaTimes size={20} />
      </button>

      {/* Заголовок */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200 active:scale-95"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Оформление заказа</h2>
            <p className="text-sm text-slate-600">Заполните данные для доставки</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoFill}
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors duration-200 text-sm active:scale-95"
          >
            Автозаполнение
          </button>
        </div>
      </div>

        {/* Контент формы */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                Ошибка при создании заказа. Пожалуйста, попробуйте еще раз.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Имя */}
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-slate-700 mb-3">
                  <FaUser size={16} />
                  Имя *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out ${
                    errors.first_name ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Введите ваше имя"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">{errors.first_name}</p>
                )}
              </div>

              {/* Адрес */}
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-slate-700 mb-3">
                  <FaMapMarkerAlt size={16} />
                  Адрес *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out ${
                    errors.address ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Улица, дом, квартира"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">{errors.address}</p>
                )}
              </div>

              {/* Телефон */}
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-slate-700 mb-3">
                  <FaPhone size={16} />
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="+996 (XXX) XX-XX-XX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">{errors.phone}</p>
                )}
              </div>

              {/* Примечание */}
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-slate-700 mb-3">
                  <FaNotesMedical size={16} />
                  Примечание к заказу
                </label>
                <textarea
                  name="customer_note"
                  value={formData.customer_note}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out resize-none"
                  placeholder="Комментарии к заказу (необязательно)"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Футер с итоговой суммой и кнопкой */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 p-6 bg-white shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-slate-800">Итого:</span>
              <span className="text-3xl font-black text-orange-600">{totalAmount.toFixed(0)} сом</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 ease-out flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl"
            >
              <FaShoppingBag size={20} />
              {isSubmitting ? 'Создание заказа...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
    </div>
  );
};