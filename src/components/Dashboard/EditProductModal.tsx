import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaImage, FaTag, FaDollarSign, FaFileAlt, FaPlus, FaTrash, FaStar, FaFire, FaGift, FaEye, FaEyeSlash, FaBox } from 'react-icons/fa';
import { useGetProductCategoriesQuery, useUpdateProductMutation, useUploadImageMutation } from '../../app/services/api';
import type { Product, ProductStatus } from '../../types/types';

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

interface ImagePreview {
  file?: File;
  preview: string;
  id: string;
  imageId?: number;
}

const PRODUCT_STATUSES: { value: ProductStatus; label: string; icon: React.ComponentType<{ size?: number }> | null; color: string }[] = [
  { value: 'hit', label: 'Хит продаж', icon: FaFire, color: 'from-red-500 to-red-600' },
  { value: 'new', label: 'Новинка', icon: FaStar, color: 'from-blue-500 to-blue-600' },
  { value: 'sale', label: 'Скидка', icon: FaGift, color: 'from-green-500 to-green-600' },
  { value: 'none', label: 'Без статуса', icon: null, color: 'from-slate-400 to-slate-500' },
];

export const EditProductModal = ({ isOpen, product, onClose }: EditProductModalProps) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [productStatus, setProductStatus] = useState<ProductStatus>('none');
  const [isHidden, setIsHidden] = useState(false);
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: categories } = useGetProductCategoriesQuery({ per_page: 100 });
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();

  // Функция для удаления HTML тегов из текста
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || '');
      // Убираем HTML теги из описания
      const cleanDescription = stripHtmlTags(product.description || '');
      setDescription(cleanDescription);
      setRegularPrice(product.regular_price || '');
      setSalePrice(product.sale_price || '');
      setSelectedCategory(product.categories?.[0]?.id || null);
      setWeight(product.weight?.toString() || '');
      
      // Устанавливаем статус скрытия товара
      setIsHidden(product.status === 'draft');
      
      // Загружаем существующие изображения
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          preview: img.src,
          id: img.id.toString(),
          imageId: img.id,
        })));
      }

      // Определяем статус из тегов
      const tags = product.tags || [];
      if (tags.some(t => t.slug === 'hit' || t.name.toLowerCase().includes('хит'))) {
        setProductStatus('hit');
      } else if (tags.some(t => t.slug === 'new' || t.name.toLowerCase().includes('новинка'))) {
        setProductStatus('new');
      } else if (tags.some(t => t.slug === 'sale' || t.name.toLowerCase().includes('скидка'))) {
        setProductStatus('sale');
      } else {
        setProductStatus('none');
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

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
      if (image?.file) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!name || !selectedCategory || images.length === 0 || !regularPrice) {
      alert('Заполните все обязательные поля');
      return;
    }

    // Валидация веса
    if (weight && (isNaN(parseFloat(weight)) || parseFloat(weight) < 0)) {
      alert('Вес должен быть положительным числом');
      return;
    }

    setIsSubmitting(true);
    try {
      // Загружаем новые изображения
      const imageIds: number[] = [];
      for (const image of images) {
        if (image.imageId) {
          // Существующее изображение
          imageIds.push(image.imageId);
        } else if (image.file) {
          // Новое изображение
          const formData = new FormData();
          formData.append('file', image.file);
          try {
            const uploadResult = await uploadImage(formData).unwrap();
            imageIds.push(uploadResult.id);
          } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
          }
        }
      }

      // Подготавливаем теги для статуса
      const statusTags: { id?: number; name: string; slug: string }[] = [];
      if (productStatus !== 'none') {
        const statusConfig = PRODUCT_STATUSES.find(s => s.value === productStatus);
        if (statusConfig) {
          statusTags.push({
            name: statusConfig.label,
            slug: productStatus,
          });
        }
      }

      // Обновляем товар
      const productData: Record<string, unknown> = {
        name,
        categories: [{ id: selectedCategory }],
        images: imageIds.map(id => ({ id })),
        description: description, // Сохраняем как plain text
        short_description: description,
        regular_price: regularPrice,
        status: isHidden ? 'draft' : 'publish', // Устанавливаем статус в зависимости от флага
        weight: weight || '', // WooCommerce ожидает строку для веса
        tags: statusTags,
      };

      if (salePrice) {
        productData.sale_price = salePrice;
      } else {
        productData.sale_price = '';
      }

      console.log('Отправка данных товара:', productData);
      await updateProduct({ id: product.id, ...productData }).unwrap();
      onClose();
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      
      // Показываем более детальную ошибку
      if (error && typeof error === 'object' && 'data' in error) {
        const errorMessage = (error as { data?: { message?: string } }).data?.message || 'Ошибка при обновлении товара';
        alert(`Ошибка: ${errorMessage}`);
      } else {
        alert('Ошибка при обновлении товара. Проверьте консоль для деталей.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Очищаем превью новых изображений
    images.forEach(image => {
      if (image.file) {
        URL.revokeObjectURL(image.preview);
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900">Редактировать товар</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
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
                  </div>
                ) : (
                  <div className="space-y-4">
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
                {/* Статус товара */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Статус товара
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_STATUSES.map((status) => {
                      const Icon = status.icon;
                      return (
                        <button
                          key={status.value}
                          onClick={() => setProductStatus(status.value)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            productStatus === status.value
                              ? `bg-linear-to-r ${status.color} text-white border-transparent shadow-lg`
                              : 'bg-white border-slate-200 text-slate-600 hover:border-orange-500'
                          }`}
                        >
                          {Icon && <div className="mx-auto mb-1"><Icon size={16} /></div>}
                          <span className="text-xs font-bold">{status.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Скрыть/Показать товар */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Видимость на витрине
                  </label>
                  <button
                    onClick={() => setIsHidden(!isHidden)}
                    className={`w-full p-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-3 ${
                      isHidden 
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {isHidden ? (
                      <>
                        <FaEyeSlash size={16} />
                        <span>Товар скрыт с витрины</span>
                      </>
                    ) : (
                      <>
                        <FaEye size={16} />
                        <span>Товар виден на витрине</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    {isHidden 
                      ? 'Товар будет изменен на статус "Черновик" и не будет отображаться на сайте'
                      : 'Товар будет опубликован и виден всем посетителям сайта'
                    }
                  </p>
                </div>

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
                      💡 Создайте категорию "Комбо" в WordPress для комбо-наборов
                    </p>
                  )}
                </div>

                {/* Название */}
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название товара"
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
                    placeholder="Описание товара..."
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
                    <label className="block text-sm font-black text-slate-700 mb-2">
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

                {/* Кнопка сохранения */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name || !selectedCategory || images.length === 0 || !regularPrice}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 md:py-3 rounded-xl font-black text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 md:mt-6 active:scale-95"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

