import { useState, useLayoutEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addToCart, clearCart, removeFromCart } from "../../../app/slices/cartSlice";
import { closeCart, openReceipts } from "../../../app/slices/uiSlice";

import { useScrollLockStore } from "../../../stores/scrollLockStore";

import type { Product, PublicOrder, CartItem } from "../../../types";

interface UseCartProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

export const useCart = ({ searchParams, setSearchParams }: UseCartProps) => {
  const SITE_URL = import.meta.env.VITE_SITE_URL;

  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [createdOrderData, setCreatedOrderData] =
    useState<PublicOrder | null>(null);

  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);


  /* =========================
     SCROLL LOCK
  ========================= */

  useLayoutEffect(() => {
    if (!showCheckoutForm) {
      lockScroll();
      return () => unlockScroll();
    }

    return undefined;
  }, [showCheckoutForm, lockScroll, unlockScroll]);

  /* =========================
     CART ITEMS
  ========================= */

  const cartItems: CartItem[] = Object.values(cart);

  const totalAmount = cartItems.reduce((sum: number, item) => {
    const price = parseFloat(item.sale_price || item.price || "0");
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce(
    (sum: number, item) => sum + item.quantity,
    0
  );

  /* =========================
     CART ACTIONS
  ========================= */

 const handleAdd = (product: Product) => {
  dispatch(addToCart(product));
};

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCloseCart = () => {
    dispatch(closeCart());

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");

    setSearchParams(newParams);
  };

  /* =========================
     CHECKOUT
  ========================= */

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutBack = () => {
    setShowCheckoutForm(false);
  };

  const handleCheckoutSuccess = () => {
    dispatch(clearCart());
    setShowCheckoutForm(false);
    dispatch(openReceipts());
  };

  const handleCheckoutShowReceipt = (orderData: PublicOrder) => {
    dispatch(clearCart());

    setCreatedOrderData(orderData);
    setShowReceipt(true);
  };

  /* =========================
     RECEIPT
  ========================= */

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setShowCheckoutForm(false);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "mycheks");

    setSearchParams(newParams);
  };

  const handleReceiptNewOrder = () => {
    setShowReceipt(false);
    setShowCheckoutForm(false);

    dispatch(closeCart());

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");

    setSearchParams(newParams);
  };

  return {
    siteUrl: SITE_URL,


    cartItems,
    totalAmount,
    totalItems,

    showCheckoutForm,
    showReceipt,
    createdOrderData,

    handleAdd,
    handleRemove,
    handleClearCart,
    handleCloseCart,

    handleCheckout,
    handleCheckoutBack,
    handleCheckoutSuccess,
    handleCheckoutShowReceipt,

    handleReceiptClose,
    handleReceiptNewOrder,
  };
};