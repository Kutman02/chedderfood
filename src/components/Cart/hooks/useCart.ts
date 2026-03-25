import { useState, useLayoutEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart, clearCart, removeFromCart } from "@/app/slices/cartSlice";
import { closeCart} from "@/app/slices/uiSlice";

import { useScrollLockStore } from "@/stores/scrollLockStore";

import type { Product, PublicOrder, CartItem } from "../../../types";

interface UseCartProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

export const useCart = ({ searchParams, setSearchParams }: UseCartProps) => {
  const SITE_URL = import.meta.env.VITE_SITE_URL;

  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);

  const [showReceipt, setShowReceipt] = useState(false);
  const [createdOrderData, setCreatedOrderData] =
    useState<PublicOrder | null>(null);

  const lockScroll = useScrollLockStore((s) => s.lock);
  const unlockScroll = useScrollLockStore((s) => s.unlock);

  /* =========================
     URL STATE
  ========================= */

  const step = searchParams.get("step"); // cart | checkout

  /* =========================
     SCROLL LOCK
  ========================= */

  useLayoutEffect(() => {
    if (step === "cart") {
      lockScroll();
      return () => unlockScroll();
    }

    return undefined;
  }, [step, lockScroll, unlockScroll]);

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

    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    params.delete("step");

    setSearchParams(params);
  };

  /* =========================
     NAVIGATION (ВАЖНО)
  ========================= */

  const handleCheckout = () => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "cart");
    params.set("step", "checkout");

    setSearchParams(params);
  };

  const handleBackToCart = () => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "cart");
    params.set("step", "cart");

    setSearchParams(params);
  };

  /* =========================
     RECEIPT
  ========================= */

  const handleCheckoutShowReceipt = (orderData: PublicOrder) => {
    dispatch(clearCart());

    setCreatedOrderData(orderData);
    setShowReceipt(true);
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);

    const params = new URLSearchParams(searchParams);
    params.set("modal", "mycheks");
    params.delete("step");

    setSearchParams(params);
  };

  const handleReceiptNewOrder = () => {
    setShowReceipt(false);

    dispatch(closeCart());

    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    params.delete("step");

    setSearchParams(params);
  };

  return {
    siteUrl: SITE_URL,

    cartItems,
    totalAmount,
    totalItems,

    step,

    showReceipt,
    createdOrderData,

    handleAdd,
    handleRemove,
    handleClearCart,
    handleCloseCart,

    handleCheckout,
    handleBackToCart,

    handleCheckoutShowReceipt,

    handleReceiptClose,
    handleReceiptNewOrder,
  };
};