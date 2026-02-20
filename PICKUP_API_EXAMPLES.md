# API примеры - Самовывоз (Pickup)

## 1️⃣ Создание заказа с типом Самовывоз

### Request к WooCommerce API

```bash
POST /wp-json/wc/v3/orders
Content-Type: application/json

{
  "status": "on-hold",
  "customer_id": 0,
  "billing": {
    "first_name": "Иван",
    "last_name": "Иванов",
    "address_1": "ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан",
    "phone": "+996501234567",
    "email": "customer_1708437600000@example.com"
  },
  "shipping": {
    "first_name": "Иван",
    "last_name": "Иванов",
    "address_1": "ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан"
  },
  "line_items": [
    {
      "product_id": 123,
      "quantity": 2
    },
    {
      "product_id": 456,
      "quantity": 1
    }
  ],
  "customer_note": "Готовить без лука",
  "total": "1500",
  "currency": "KGS",
  "meta_data": [
    {
      "key": "order_type",
      "value": "pickup"  // ← КЛЮЧЕВОЕ ПОЛЕ
    }
  ]
}
```

### Response

```json
{
  "id": 12345,
  "number": "12345",
  "status": "on-hold",
  "date_created": "2024-02-20T12:30:00",
  "billing": {
    "first_name": "Иван",
    "address_1": "ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан",
    "phone": "+996501234567"
  },
  "meta_data": [
    {
      "id": 789,
      "key": "order_type",
      "value": "pickup"
    }
  ],
  "total": "1500",
  "currency": "KGS"
}
```

---

## 2️⃣ Создание заказа с типом Доставка

### Request

```bash
POST /wp-json/wc/v3/orders
Content-Type: application/json

{
  "status": "on-hold",
  "customer_id": 0,
  "billing": {
    "first_name": "Петр",
    "address_1": "ул. Логинова, 123, квартира 45, Бишкек",
    "phone": "+996701234567",
    "email": "customer_1708437600000@example.com"
  },
  "shipping": {
    "first_name": "Петр",
    "address_1": "ул. Логинова, 123, квартира 45, Бишкек"
  },
  "line_items": [
    {
      "product_id": 123,
      "quantity": 1
    }
  ],
  "meta_data": [
    {
      "key": "order_type",
      "value": "delivery"  // ← ДЛЯ ДОСТАВКИ
    }
  ],
  "total": "800",
  "currency": "KGS"
}
```

---

## 3️⃣ Получение заказа с типом

### Request

```bash
GET /wp-json/wc/v3/orders/12345
```

### Response с meta_data

```json
{
  "id": 12345,
  "number": "12345",
  "status": "on-hold",
  "billing": {
    "first_name": "Иван",
    "address_1": "ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан",
    "phone": "+996501234567"
  },
  "line_items": [
    {
      "id": 1,
      "name": "Манты",
      "product_id": 123,
      "quantity": 2,
      "price": "350",
      "total": "700"
    }
  ],
  "meta_data": [
    {
      "id": 789,
      "key": "order_type",
      "value": "pickup"  // ← МОЖНО ЧИТАТЬ НА ФРОНТЕНДЕ
    }
  ],
  "total": "1500",
  "currency": "KGS",
  "date_created": "2024-02-20T12:30:00"
}
```

---

## 4️⃣ Получение списка заказов

### Request

```bash
GET /wp-json/wc/v3/orders?per_page=10&status=on-hold
```

### Response (каждый заказ содержит meta_data)

```json
[
  {
    "id": 12345,
    "number": "12345",
    "status": "on-hold",
    "billing": { ... },
    "meta_data": [
      {
        "id": 789,
        "key": "order_type",
        "value": "pickup"  // ← ВИДНО В СПИСКЕ
      }
    ],
    "total": "1500"
  },
  {
    "id": 12346,
    "number": "12346",
    "status": "on-hold",
    "billing": { ... },
    "meta_data": [
      {
        "id": 790,
        "key": "order_type",
        "value": "delivery"
      }
    ],
    "total": "800"
  }
]
```

---

## 5️⃣ Фильтрация заказов по типу (примеры)

### Только самовывозы (на фронтенде)

```typescript
const pickupOrders = orders.filter(order => {
  const orderTypeMeta = order.meta_data?.find(m => m.key === 'order_type');
  return orderTypeMeta?.value === 'pickup';
});
```

### Только доставки (на фронтенде)

```typescript
const deliveryOrders = orders.filter(order => {
  const orderTypeMeta = order.meta_data?.find(m => m.key === 'order_type');
  return orderTypeMeta?.value === 'delivery';
});
```

---

## 6️⃣ JavaScript пример (React)

### Создание заказа в Checkout

```typescript
const handleConfirmOrder = async () => {
  const orderData = {
    status: 'on-hold',
    customer_id: 0,
    billing: {
      first_name: formData.first_name,
      address_1: orderType === 'pickup' 
        ? RESTAURANT_ADDRESS 
        : formData.address,
      phone: formData.phone,
      email: `customer_${Date.now()}@example.com`,
    },
    line_items: cartItems,
    customer_note: formData.customer_note,
    total: totalAmount.toString(),
    currency: 'KGS',
    meta_data: [
      {
        key: 'order_type',
        value: orderType === 'pickup' ? 'pickup' : 'delivery', // ← ВСЕ ПРОСТО!
      },
    ],
  };

  const orderResponse = await createOrder(orderData).unwrap();
  console.log('Заказ создан:', orderResponse);
};
```

### Отображение типа в Dashboard

```typescript
export const OrderCard = ({ order }) => {
  const orderTypeMeta = order.meta_data?.find(m => m.key === 'order_type');
  const isPickup = orderTypeMeta?.value === 'pickup';

  return (
    <div>
      {isPickup ? (
        <div className="bg-green-600 text-white px-3 py-2">
          🏪 Самовывоз
        </div>
      ) : (
        <div className="bg-blue-600 text-white px-3 py-2">
          🚚 Доставка
        </div>
      )}
    </div>
  );
};
```

---

## 7️⃣ WordPress плагин (PHP)

### Отображение в админ-панели

```php
<?php
add_action('woocommerce_admin_order_data_after_order_details', function($order){
    $order_type = '';
    
    foreach ($order->get_meta_data() as $meta) {
        if ($meta->key === 'order_type') {
            $order_type = $meta->value;
            break;
        }
    }

    if ($order_type) {
        $label = $order_type === 'pickup' ? 'Самовывоз' : 'Доставка';
        echo '<p><strong>Тип заказа:</strong> ' . esc_html($label) . '</p>';
    }
});
?>
```

**Результат в админ-панели:**
```
Тип заказа: Самовывоз ✓
```

---

## 📊 Структура meta_data

```typescript
interface MetaData {
  id: number;           // ID в БД (присваивается автоматически)
  key: string;          // 'order_type'
  value: string;        // 'pickup' или 'delivery'
}

// В заказе:
order.meta_data = [
  {
    id: 789,
    key: 'order_type',
    value: 'pickup'
  }
]
```

---

## ✅ Проверка работы

### 1. Создайте заказ с `order_type: 'pickup'`
```bash
curl -X POST "https://your-site.com/wp-json/wc/v3/orders" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "on-hold",
    "customer_id": 0,
    "billing": { "first_name": "Тест", "address_1": "Адрес" },
    "meta_data": [{ "key": "order_type", "value": "pickup" }]
  }'
```

### 2. Получите заказ и проверьте meta_data
```bash
curl -X GET "https://your-site.com/wp-json/wc/v3/orders/12345" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Откройте заказ в WooCommerce админ-панели
Должно быть видно:
```
Тип заказа: Самовывоз ✓
```

---

## 🔐 Безопасность

- ✅ `meta_data` валидируется WooCommerce
- ✅ Значения экранируются через `esc_html()`
- ✅ Нет SQL-инъекций (WooCommerce использует ORM)
- ✅ Авторизация проверяется автоматически

---

## 📋 Тип данных в TypeScript

```typescript
export type Order = {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
  billing: {
    first_name: string;
    address_1: string;
    phone: string;
  };
  line_items: OrderItem[];
  customer_note?: string;
  meta_data?: Array<{  // ← НОВОЕ ПОЛЕ
    id: number;
    key: string;
    value: string;
  }>;
};
```

---

**Версия:** 1.0.0  
**Последнее обновление:** 20.02.2026
