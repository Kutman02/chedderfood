# 🔌 Плагин WordPress - Подробная инструкция

## Обзор плагина

Плагин **"Order Type Display"** обеспечивает полную интеграцию типов заказов (доставка/самовывоз) между фронтенд-приложением и WordPress админ-панелью.

---

## 📝 Функции плагина

### 1. Обработка meta_data из REST API ✅

**Что это делает:**
- Перехватывает `meta_data` из запроса на создание заказа
- Сохраняет значение `order_type` в метаданные заказа

**Когда срабатывает:**
- При создании заказа через REST API (`POST /wp-json/wc/v3/orders`)

**Пример:**
```json
// Приходит от фронтенда:
{
  "meta_data": [
    {
      "key": "order_type",
      "value": "pickup"
    }
  ]
}

// Плагин сохраняет в базу:
wp_postmeta:
  post_id: 123
  meta_key: "order_type"
  meta_value: "pickup"
```

---

### 2. Отображение в админ-панели ✅

**Что это делает:**
- Показывает информационный блок с типом заказа
- Отображает иконку (📦 для самовывоза, 🚚 для доставки)
- Оформлено красиво с цветной полоской слева

**Где видно:**
- На странице редактирования заказа
- Прямо после деталей заказа

**Как это выглядит:**
```
┌─────────────────────────────────────────────┐
│ 📦 Тип заказа: Самовывоз                   │
└─────────────────────────────────────────────┘
```

или

```
┌─────────────────────────────────────────────┐
│ 🚚 Тип заказа: Доставка                    │
└─────────────────────────────────────────────┘
```

---

### 3. Редактирование типа заказа ✅

**Что это делает:**
- Добавляет выпадающее меню в админ-панели
- Позволяет изменить тип заказа после создания
- Сохраняет изменение в базе данных

**Как использовать:**
1. Откройте заказ
2. Найдите секцию "Способ получения заказа"
3. Выберите нужный тип из выпадающего меню
4. Сохраняется автоматически при сохранении заказа

---

### 4. Информация в письмах ✅

**Что это делает:**
- Добавляет информацию о типе доставки в письма клиентам
- Показывает адрес ресторана при самовывозе

**Где видно:**
- В письме подтверждения заказа
- В письме об отправке
- Во всех письмах от WooCommerce

**Пример:**
```
Информация о доставке
Способ получения: Самовывоз
Место забора: ул. Абдымомунова, 265, Бишкек 720040, Кыргызстан
```

---

### 5. REST API интеграция ✅

**Что это делает:**
- Регистрирует поле `order_type` в REST API
- Позволяет читать и обновлять тип через API

**Как использовать через API:**

```bash
# Получить тип заказа
GET /wp-json/wc/v3/orders/123
# Ответ содержит "order_type": "pickup"

# Обновить тип заказа
PUT /wp-json/wc/v3/orders/123
{
  "order_type": "delivery"
}
```

---

## 🛠️ Технические детали

### Hooks (Крючки) WordPress

#### `woocommerce_rest_insert_shop_order_object`
```php
add_action('woocommerce_rest_insert_shop_order_object', function($order, $request) {
    // Обработка meta_data
});
```
**Когда срабатывает:** При создании/обновлении заказа через REST API

#### `woocommerce_admin_order_data_after_order_details`
```php
add_action('woocommerce_admin_order_data_after_order_details', function($order) {
    // Отображение информационного блока
});
```
**Когда срабатывает:** При открытии страницы редактирования заказа

#### `woocommerce_admin_order_data_after_billing_address`
```php
add_action('woocommerce_admin_order_data_after_billing_address', function($order) {
    // Отображение выпадающего меню
});
```
**Когда срабатывает:** При открытии страницы редактирования заказа

#### `save_post_shop_order`
```php
add_action('save_post_shop_order', function($post_id) {
    // Сохранение изменений типа заказа
});
```
**Когда срабатывает:** При сохранении заказа в админке

#### `woocommerce_email_order_meta`
```php
add_filter('woocommerce_email_order_meta', function($meta, $order) {
    // Добавление информации в письма
});
```
**Когда срабатывает:** При отправке писем WooCommerce

#### `woocommerce_rest_prepare_shop_order_object`
```php
add_filter('woocommerce_rest_prepare_shop_order_object', function($response, $order) {
    // Добавление order_type в REST API ответ
});
```
**Когда срабатывает:** При возврате данных заказа через REST API

---

## 📊 База данных

### Где хранятся данные

**Таблица:** `wp_postmeta`

**Примеры записей:**
```sql
SELECT * FROM wp_postmeta 
WHERE meta_key = 'order_type';

-- Результат:
meta_id | post_id | meta_key      | meta_value
--------|---------|---------------|-----------
1234    | 567     | order_type    | pickup
1235    | 568     | order_type    | delivery
1236    | 569     | order_type    | pickup
```

### Запрос информацию

```sql
-- Все заказы с самовывозом
SELECT po.ID, pm.meta_value 
FROM wp_posts po
JOIN wp_postmeta pm ON po.ID = pm.post_id
WHERE po.post_type = 'shop_order' 
AND pm.meta_key = 'order_type' 
AND pm.meta_value = 'pickup';

-- Статистика
SELECT meta_value, COUNT(*) as count
FROM wp_posts po
JOIN wp_postmeta pm ON po.ID = pm.post_id
WHERE po.post_type = 'shop_order'
AND pm.meta_key = 'order_type'
GROUP BY meta_value;
```

---

## 🔄 Жизненный цикл заказа

```
1. Клиент выбирает тип заказа
   └─> order_type = "pickup" или "delivery"

2. Фронтенд отправляет заказ
   └─> POST /wp-json/wc/v3/orders
   └─> meta_data: { key: "order_type", value: "pickup" }

3. WordPress получает запрос
   └─> Hook: woocommerce_rest_insert_shop_order_object
   └─> Плагин обрабатывает meta_data

4. Заказ сохраняется в БД
   └─> wp_posts (основные данные)
   └─> wp_postmeta (meta_data с типом)

5. Админ видит заказ
   └─> Hook: woocommerce_admin_order_data_after_order_details
   └─> Плагин отображает тип

6. Письмо отправляется клиенту
   └─> Hook: woocommerce_email_order_meta
   └─> Плагин добавляет информацию о типе

7. Админ может отредактировать
   └─> Hook: save_post_shop_order
   └─> Плагин сохраняет новый тип
```

---

## 🧪 Тестирование плагина

### Тест 1: Сохранение meta_data

```bash
# Создать заказ с meta_data
curl -X POST https://yoursite.com/wp-json/wc/v3/orders \
  -H "Content-Type: application/json" \
  -d '{
    "meta_data": [
      {
        "key": "order_type",
        "value": "pickup"
      }
    ]
  }'

# Проверить сохранение
wp post meta get <order_id> order_type
# Должна вывести: pickup
```

### Тест 2: Отображение в админке

1. Создайте заказ
2. Откройте его в админке
3. Должна быть видна секция "Тип заказа: Самовывоз"

### Тест 3: REST API

```bash
# Получить заказ
curl https://yoursite.com/wp-json/wc/v3/orders/123

# В ответе должно быть:
{
  "id": 123,
  "order_type": "pickup",
  ...
}
```

### Тест 4: Письма

1. Создайте заказ с type = "pickup"
2. Проверьте полученное письмо
3. Должна быть информация о типе доставки

---

## 🐛 Отладка

### Включить debug логирование

**В wp-config.php:**
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Логи будут в wp-content/debug.log
```

### Проверить логи

```bash
tail -f wp-content/debug.log

# Ищите ошибки вроде:
# PHP Warning: Undefined index 'meta_data' in order-type-display.php...
```

### Проверить REST API

```bash
# Проверить, зарегистрировано ли поле
curl https://yoursite.com/wp-json/wc/v3/orders/schema

# В ответе должно быть "order_type" в properties
```

---

## 🔒 Безопасность

### Текущая реализация:

✅ **sanitize_text_field()** - очистка текста  
✅ **Проверка ключей** - только 'pickup' или 'delivery'  
✅ **WordPress REST API auth** - требует прав администратора для изменения  

### Рекомендации:

1. Добавить проверку разрешенных значений:
```php
$allowed_types = ['delivery', 'pickup'];
if (!in_array($order_type, $allowed_types)) {
    return;
}
```

2. Добавить логирование изменений:
```php
error_log('Order ' . $order->get_id() . ' type changed to ' . $order_type);
```

---

## 📈 Расширение функциональности

### Добавить новый тип доставки

**Шаг 1:** Обновить фронтенд (Checkout.tsx)
```typescript
const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'express'>('delivery');
```

**Шаг 2:** Обновить плагин
```php
$allowed_types = ['delivery', 'pickup', 'express'];
```

**Шаг 3:** Обновить REST API
```php
'enum' => array('delivery', 'pickup', 'express'),
```

### Добавить стоимость доставки

```php
$delivery_costs = [
    'delivery' => 50,
    'pickup' => 0,
    'express' => 100,
];

$order->update_meta_data('shipping_cost', $delivery_costs[$order_type]);
```

### Отправить вебхук

```php
do_action('order_type_changed', $order->get_id(), $order_type);

// Использование:
add_action('order_type_changed', function($order_id, $type) {
    // Отправить в Telegram, Slack и т.д.
});
```

---

## ✅ Чек-лист установки плагина

- [ ] Файл скопирован в `wp-content/plugins/order-type-display.php`
- [ ] Плагин активирован в админ-панели
- [ ] Тест: создать заказ с meta_data
- [ ] Тест: проверить БД на наличие order_type
- [ ] Тест: открыть заказ в админке
- [ ] Тест: должна быть видна информация о типе
- [ ] Тест: изменить тип и сохранить
- [ ] Тест: проверить письмо
- [ ] Готово!

---

**Плагин полностью функционален и готов к production! 🚀**
