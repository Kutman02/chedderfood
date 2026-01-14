import React, { useState, useRef } from 'react';
import { FaTimes, FaImage, FaTag, FaDollarSign, FaFileAlt, FaPlus, FaTrash, FaBox } from 'react-icons/fa';
import { useGetProductCategoriesQuery, useCreateProductMutation, useUploadImageMutation } from '../../app/services/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: categories } = useGetProductCategoriesQuery({ per_page: 100 });
  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!name || !selectedCategory || images.length === 0 || !regularPrice) {
      alert('Заполните все обязательные поля: фото, категория, название и цена');
      return;
    }

    // Валидация веса
    if (weight && (isNaN(parseFloat(weight)) || parseFloat(weight) < 0)) {
      alert('Вес должен быть положительным числом');
      return;
    }

    setIsSubmitting(true);
    try {
      // Application Password обрабатывается автоматически через api.ts
      // Не нужно проверять nonce - загрузка изображений будет использовать Application Password
      console.log('✅ Starting image upload with Application Password (handled automatically by api.ts)');
      
      // Загружаем изображения
      const imageIds: number[] = [];
      for (const image of images) {
        const formData = new FormData();
        // WordPress REST API требует, чтобы файл был передан с правильным именем
        formData.append('file', image.file, image.file.name);
        
        try {
          console.log('Загрузка изображения:', image.file.name, 'Размер:', image.file.size);
          const uploadResult = await uploadImage(formData).unwrap();
          console.log('Изображение загружено успешно:', uploadResult);
          
          if (uploadResult && uploadResult.id) {
            imageIds.push(uploadResult.id);
          } else {
            throw new Error('Ответ сервера не содержит ID изображения');
          }
        } catch (error: unknown) {
          console.error('Ошибка загрузки изображения:', error);
          
          // Проверяем, является ли это ошибкой невалидного nonce или прав доступа (403 или 401)
          const isInvalidNonceError = error && typeof error === 'object' && 'status' in error && 
            (error.status === 403 || error.status === 401) &&
            'data' in error && 
            typeof error.data === 'object' && 
            error.data !== null &&
            'code' in error.data &&
            (error.data.code === 'rest_cookie_invalid_nonce' || 
             error.data.code === 'rest_cannot_create' || 
             error.data.code === 'rest_forbidden' || 
             error.status === 401);
          
          if (isInvalidNonceError) {
            console.warn('⚠️ Got authentication error (403/401)');
            console.warn('💡 Check Application Password configuration in .env file');
            console.warn('💡 Required: VITE_WP_USERNAME and VITE_WP_APP_PASSWORD');
            
            // Проверяем конфигурацию Application Password
            const { WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } = await import('../../app/services/apiConfig');
            if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
              alert('Application Password не настроен! Проверьте переменные окружения VITE_WP_USERNAME и VITE_WP_APP_PASSWORD');
              setIsSubmitting(false);
              return;
            }
            
            console.log('🔄 Retrying upload...');
            
            try {
              const retryResult = await uploadImage(formData).unwrap();
              if (retryResult && retryResult.id) {
                imageIds.push(retryResult.id);
                console.log('✅ Image uploaded successfully after retry');
                continue; // Успешно после повтора, переходим к следующему изображению
              }
            } catch (retryError) {
              console.error('❌ Retry also failed:', retryError);
              
              // Проверяем, является ли это ошибкой прав доступа (401/403)
              const isPermissionError = retryError && typeof retryError === 'object' && 'status' in retryError && 
                (retryError.status === 401 || retryError.status === 403) &&
                'data' in retryError && 
                typeof retryError.data === 'object' && 
                retryError.data !== null &&
                'code' in retryError.data &&
                (retryError.data.code === 'rest_cannot_create' || retryError.data.code === 'rest_forbidden');
              
              if (isPermissionError) {
                // Проверяем, настроен ли Application Password
                const { WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD } = await import('../../app/services/apiConfig');
                const hasAppPassword = WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD;
                
                if (!hasAppPassword) {
                  const errorMsg = 'Ошибка аутентификации: куки не передаются при прямом подключении к бэкенду.\n\n' +
                    'РЕШЕНИЕ: Настройте Application Password в WordPress:\n' +
                    '1. Перейдите в WordPress: Users > Your Profile > Application Passwords\n' +
                    '2. Создайте новый Application Password\n' +
                    '3. Добавьте в .env файл:\n' +
                    '   VITE_WP_USERNAME=your_username\n' +
                    '   VITE_WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx\n' +
                    '4. Перезапустите dev сервер';
                  throw new Error(errorMsg);
                } else {
                  const errorMessage = retryError && typeof retryError === 'object' && 'data' in retryError
                    ? (retryError as { data?: { message?: string } }).data?.message || 'Ошибка загрузки'
                    : 'Ошибка загрузки изображения';
                  throw new Error(`${errorMessage}. Проверьте правильность Application Password в .env файле.`);
                }
              } else {
                const errorMessage = retryError && typeof retryError === 'object' && 'data' in retryError
                  ? (retryError as { data?: { message?: string } }).data?.message || 'Ошибка загрузки'
                  : 'Ошибка загрузки изображения';
                throw new Error(`${errorMessage}. Попробуйте выйти и войти снова.`);
              }
            }
          } else {
            // Если это не ошибка аутентификации, просто пробрасываем ошибку дальше
            const errorMessage = error && typeof error === 'object' && 'data' in error
              ? (error as { data?: { message?: string } }).data?.message || 'Неизвестная ошибка'
              : 'Ошибка загрузки изображения';
            alert(`Ошибка загрузки изображения "${image.file.name}": ${errorMessage}`);
            throw error; // Прерываем процесс, если загрузка не удалась
          }
        }
      }

      // Создаем товар
      const productData: Record<string, unknown> = {
        name,
        type: 'simple',
        status: 'publish',
        categories: [{ id: selectedCategory }],
        images: imageIds.map(id => ({ id })),
        description: description, // Сохраняем как plain text
        short_description: description,
        regular_price: regularPrice,
        stock_status: 'instock',
        weight: weight || '', // WooCommerce ожидает строку для веса
      };

      if (salePrice) {
        productData.sale_price = salePrice;
      }

      await createProduct(productData).unwrap();
      
      // Очищаем форму
      setImages([]);
      setName('');
      setDescription('');
      setRegularPrice('');
      setSalePrice('');
      setWeight('');
      setSelectedCategory(null);
      onClose();
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      alert('Ошибка при создании товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Очищаем превью изображений
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    setName('');
    setDescription('');
    setRegularPrice('');
    setSalePrice('');
    setSelectedCategory(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900">Создать новый товар</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content - Instagram style layout */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Левая часть - Изображения */}
            <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 md:p-6">
              <div className="sticky top-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                {images.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center cursor-pointer hover:border-orange-500 transition-colors bg-white"
                  >
                    <FaImage className="text-5xl text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-black text-lg mb-2">Выберите фото</p>
                    <p className="text-sm text-slate-500">Можно выбрать несколько изображений</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Основное изображение (первое) */}
                    <div className="relative group bg-white rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={images[0].preview}
                        alt="Main preview"
                        className="w-full h-96 object-cover"
                      />
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
                          +{images.length - 1} фото
                        </div>
                      )}
                      <button
                        onClick={() => removeImage(images[0].id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    {/* Миниатюры остальных изображений */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(1).map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.preview}
                              alt="Preview"
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(image.id)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ))}
                        {images.length < 10 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors bg-white"
                          >
                            <FaPlus className="text-slate-400" size={16} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Кнопка добавить еще фото */}
                    {images.length === 1 && images.length < 10 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl py-4 text-center cursor-pointer hover:border-orange-500 transition-colors bg-white font-bold text-slate-600 flex items-center justify-center gap-2"
                      >
                        <FaPlus /> Добавить еще фото
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Правая часть - Форма */}
            <div className="md:w-1/2 p-4 md:p-6">
              <div className="space-y-4 md:space-y-5 max-w-md mx-auto">
                {/* Категория */}
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                    <FaTag /> Категория *
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none font-semibold bg-white"
                  >
                    <option value="">Выберите категорию</option>
                    {categories?.map((cat: { id: number; name: string }) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {!categories?.some((cat: { id: number; name: string }) => cat.name.toLowerCase().includes('комбо')) && (
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Создайте категорию "Комбо"
                    </p>
                  )}
                </div>

                {/* Название товара */}
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Шаурма классическая"
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Описание */}
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                    <FaFileAlt /> Описание
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Расскажите о товаре..."
                    rows={5}
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none resize-none"
                  />
                </div>

                {/* Цены */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                      <FaDollarSign /> Цена (сом) *
                    </label>
                    <input
                      type="number"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-black text-slate-700 mb-2">
                      Цена со скидкой (сом)
                    </label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Вес */}
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                    <FaBox /> Вес (граммы)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Укажите вес товара в граммах (необязательно)
                  </p>
                </div>

                {/* Кнопка публикации */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name || !selectedCategory || images.length === 0 || !regularPrice}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 md:py-3 rounded-xl font-black text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 md:mt-6 active:scale-95"
                >
                  {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
