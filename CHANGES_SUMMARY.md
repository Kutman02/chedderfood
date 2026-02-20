# Краткие изменения в коде

## 📝 Что изменилось в Checkout.tsx

### 1. **Импорты** (строка 2)
```diff
- import { FaTimes, FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaNotesMedical, FaShoppingBag, FaChevronDown, FaCheckCircle } from 'react-icons/fa';
+ import { FaTimes, FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaNotesMedical, FaShoppingBag, FaChevronDown, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
```

### 2. **Константы** (новые строки 10-12)
```typescript
// Адрес ресторана для самовывоза
const RESTAURANT_ADDRESS = 'ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан';
const RESTAURANT_PHONE = '+996 (312) 62-55-55';
```

### 3. **Состояние** (новая строка ~52)
```typescript
const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
```

### 4. **Валидация** (обновлена строка ~167)
```diff
- if (!formData.address.trim()) {
-   newErrors.address = 'Введите адрес';
- }
+ // Адрес требуется только при доставке
+ if (orderType === 'delivery' && !formData.address.trim()) {
+   newErrors.address = 'Введите адрес';
+ }
```

### 5. **Создание заказа** (обновлена строка ~193)
```typescript
// Добавлено в orderData
meta_data: [
  {
    key: 'order_type',
    value: orderType === 'pickup' ? 'pickup' : 'delivery',
  },
],

// Адрес выбирается в зависимости от типа
address_1: orderType === 'pickup' ? RESTAURANT_ADDRESS : formData.address,
```

### 6. **UI Форма** (новое в форме)
```typescript
// Кнопки выбора типа заказа
<button onClick={() => setOrderType('delivery')}>Доставка</button>
<button onClick={() => setOrderType('pickup')}>Самовывоз</button>

// Информация о ресторане при самовывозе
{orderType === 'pickup' && (
  <div>Адрес самовывоза: {RESTAURANT_ADDRESS}</div>
)}

// Поле адреса только для доставки
{orderType === 'delivery' && (
  <input name="address" ... />
)}
```

### 7. **Модальное окно подтверждения** (обновлено)
```typescript
// Показывает правильный адрес в зависимости от типа
<div>Адрес {orderType === 'pickup' ? '(Самовывоз)' : '(Доставка)'}</div>
<div>{orderType === 'pickup' ? RESTAURANT_ADDRESS : formData.address}</div>
```

---

## 🔌 Плагин WordPress

### Основные функции в order-type-display.php:

1. **Сохранение meta_data из API**
   - Перехватывает `meta_data` из REST API запроса
   - Сохраняет в метаданные заказа

2. **Отображение в админке**
   - Показывает тип заказа с иконкой
   - Позволяет редактировать в выпадающем списке

3. **REST API интеграция**
   - Регистрирует поле `order_type` в REST
   - Возвращает тип заказа в ответе

4. **Письма**
   - Добавляет информацию о типе доставки в письма клиентам

---

## 🎯 Ключевые моменты

✅ **Валидация адреса** - теперь зависит от типа заказа  
✅ **Скрытие/показ поля** - адрес скрывается при самовывозе  
✅ **Метаданные заказа** - отправляются с типом доставки  
✅ **Админ-панель** - видно какой тип заказа  
✅ **Письма** - содержат информацию о типе доставки  

---

## 🚀 Следующие шаги

1. Заменить адреса на реальные:
   ```typescript
   const RESTAURANT_ADDRESS = 'ваш_адрес';
   const RESTAURANT_PHONE = 'ваш_телефон';
   ```

2. Активировать плагин в WordPress

3. Протестировать создание заказов обоих типов

4. Проверить метаданные в базе данных

---
