import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FaTimes, FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaNotesMedical, FaShoppingBag, FaChevronDown } from 'react-icons/fa';
import { useCreateOrderMutation, useGetProductsQuery } from '../app/services/api';
import type { Product, CheckoutFormData } from '../types/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addReceipt, setCustomerData } from '../app/slices/receiptsSlice';
import { useScrollLockStore } from '../stores/scrollLockStore';

// Страны СНГ с кодами и форматами номеров
const CIS_COUNTRIES = [
  { code: '+996', name: 'Кыргызстан', digits: 9, flag: '🇰🇬' },
  { code: '+7', name: 'Казахстан', digits: 10, flag: '🇰🇿' },
  { code: '+7', name: 'Россия', digits: 10, flag: '🇷🇺' },
  { code: '+998', name: 'Узбекистан', digits: 9, flag: '🇺🇿' },
  { code: '+992', name: 'Таджикистан', digits: 9, flag: '🇹🇯' },
  { code: '+993', name: 'Туркменистан', digits: 8, flag: '🇹🇲' },
  { code: '+375', name: 'Беларусь', digits: 9, flag: '🇧🇾' },
  { code: '+380', name: 'Украина', digits: 9, flag: '🇺🇦' },
  { code: '+373', name: 'Молдова', digits: 8, flag: '🇲🇩' },
  { code: '+374', name: 'Армения', digits: 8, flag: '🇦🇲' },
  { code: '+994', name: 'Азербайджан', digits: 9, flag: '🇦🇿' },
  { code: '+995', name: 'Грузия', digits: 9, flag: '🇬🇪' },
];

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
  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const { data: products } = useGetProductsQuery({
    per_page: 100,
    status: 'publish',
  });

  // Блокируем прокрутку при открытии формы оформления заказа
  useLayoutEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [lockScroll, unlockScroll]);

  // Парсим сохраненный номер телефона, если есть
  const parseSavedPhone = (phone: string) => {
    if (!phone) return { country: CIS_COUNTRIES[0], number: '' };
    
    // Ищем страну по коду (сначала проверяем более длинные коды, чтобы +998 не совпал с +99)
    const sortedCountries = [...CIS_COUNTRIES].sort((a, b) => b.code.length - a.code.length);
    const country = sortedCountries.find(c => phone.startsWith(c.code));
    if (country) {
      const number = phone.replace(country.code, '').replace(/\D/g, '');
      return { country, number };
    }
    
    // Если не нашли по коду, используем Кыргызстан по умолчанию
    const digitsOnly = phone.replace(/\D/g, '');
    return { country: CIS_COUNTRIES[0], number: digitsOnly };
  };

  const savedPhoneData = parseSavedPhone(savedCustomerData?.phone || '');
  const initialPhone = savedPhoneData.number ? `${savedPhoneData.country.code}${savedPhoneData.number}` : '';
  
  const [selectedCountry, setSelectedCountry] = useState(savedPhoneData.country);
  const [phoneNumber, setPhoneNumber] = useState(savedPhoneData.number);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>(() => ({
    first_name: savedCustomerData?.first_name || '',
    address: savedCustomerData?.address || '',
    phone: initialPhone,
    customer_note: '',
  }));

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  // Обновляем formData.phone при изменении страны или номера
  useEffect(() => {
    const fullPhone = phoneNumber ? `${selectedCountry.code}${phoneNumber}` : '';
    setFormData(prev => ({ ...prev, phone: fullPhone }));
  }, [selectedCountry, phoneNumber]);

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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем только цифры
    const value = e.target.value.replace(/\D/g, '');
    // Ограничиваем длину по количеству цифр для выбранной страны
    const maxLength = selectedCountry.digits;
    const limitedValue = value.slice(0, maxLength);
    setPhoneNumber(limitedValue);
    // Очищаем ошибку
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleCountrySelect = (country: typeof CIS_COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    // Очищаем номер при смене страны, если он не подходит под новый формат
    if (phoneNumber.length > country.digits) {
      setPhoneNumber('');
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
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (phoneNumber.length !== selectedCountry.digits) {
      newErrors.phone = `Номер должен содержать ${selectedCountry.digits} цифр`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = () => {
    if (savedCustomerData) {
      const parsed = parseSavedPhone(savedCustomerData.phone);
      setSelectedCountry(parsed.country);
      setPhoneNumber(parsed.number);
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
                <div className="flex gap-2">
                  {/* Выбор страны */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className={`flex items-center gap-2 px-4 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out bg-white ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="font-medium">{selectedCountry.code}</span>
                      <FaChevronDown size={12} className="text-slate-400" />
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsCountryDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto min-w-[200px]">
                          {CIS_COUNTRIES.map((country) => (
                            <button
                              key={`${country.code}-${country.name}`}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 text-left ${
                                selectedCountry.code === country.code && selectedCountry.name === country.name
                                  ? 'bg-orange-100 font-bold'
                                  : ''
                              }`}
                            >
                              <span className="text-xl">{country.flag}</span>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-800">{country.name}</div>
                                <div className="text-xs text-slate-500">{country.code}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Поле ввода номера */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className={`flex-1 px-4 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ease-out ${
                      errors.phone ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder={`${selectedCountry.digits} цифр`}
                    maxLength={selectedCountry.digits}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">{errors.phone}</p>
                )}
                {phoneNumber && !errors.phone && (
                  <p className="text-slate-500 text-sm mt-2">
                    {selectedCountry.code}{phoneNumber}
                  </p>
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