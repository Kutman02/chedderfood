import { useSearchParams } from "react-router-dom";

import { Checkout } from "@/components/Checkout/Checkout";
import { OrderReceipt } from "@/components/OrderReceipt/OrderReceipt";

import { useCart } from "@/components/Cart/hooks/useCart";

export const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const cart = useCart({
    searchParams,
    setSearchParams,
  });

  const modal = searchParams.get("modal");

  /* =========================
     RECEIPT
  ========================= */

  if (cart.showReceipt && cart.createdOrderData) {
    return (
      <OrderReceipt
        orderData={cart.createdOrderData}
        products={[]}
        onClose={cart.handleReceiptClose}
        onNewOrder={cart.handleReceiptNewOrder}
      />
    );
  }

  /* =========================
     CHECKOUT FLOW
  ========================= */

  if (modal === "cart") {
    return (
      <Checkout
        onClose={cart.handleCloseCart}
        cartData={{
          items: cart.cartItems,
          totalAmount: cart.totalAmount,
          totalItems: cart.totalItems,
          onAdd: cart.handleAdd,
          onRemove: cart.handleRemove,
          onClear: cart.handleClearCart,
          siteUrl: cart.siteUrl,
        }}
      />
    );
  }

  return null;
};
