
import { useSearchParams } from "react-router-dom";

import { Checkout } from "../Checkout/Checkout";
import { OrderReceipt } from "../OrderReceipt";

import { CartHeader } from "./components/CartHeader";
import { CartList } from "./components/CartList";
import { CartFooter } from "./components/CartFooter";
import { CartEmpty } from "./components/CartEmpty";

import { useCart } from "./hooks/useCart";

export const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const cart = useCart({
    searchParams,
    setSearchParams,
  });

  if (cart.showReceipt && cart.createdOrderData) {
    return (
      <OrderReceipt
        orderData={cart.createdOrderData}
        products={cart.products || []}
        onClose={cart.handleReceiptClose}
        onNewOrder={cart.handleReceiptNewOrder}
      />
    );
  }

  if (cart.showCheckoutForm) {
    return (
      <Checkout
        onClose={cart.handleCloseCart}
        onBack={cart.handleCheckoutBack}
        onSuccess={cart.handleCheckoutSuccess}
        onShowReceipt={cart.handleCheckoutShowReceipt}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-100dvh">

      <CartHeader
        totalItems={cart.totalItems}
        onClose={cart.handleCloseCart}
        onClearCart={cart.handleClearCart}
        hasItems={cart.cartItems.length > 0}
      />

      {cart.cartItems.length === 0 ? (
        <CartEmpty onClose={cart.handleCloseCart} />
      ) : (
        <CartList
          items={cart.cartItems}
          onAdd={cart.handleAdd}
          onRemove={cart.handleRemove}
          siteUrl={cart.siteUrl}
        />
      )}

      {cart.cartItems.length > 0 && (
        <CartFooter
          totalAmount={cart.totalAmount}
          onCheckout={cart.handleCheckout}
        />
      )}

    </div>
  );
};