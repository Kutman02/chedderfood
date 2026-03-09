import { useState, useLayoutEffect } from "react";
import { useGetProductsQuery } from "../../../app/services/api";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addToCart, clearCart, removeFromCart } from "../../../app/slices/cartSlice";
import { closeCart, openReceipts } from "../../../app/slices/uiSlice";

import { useScrollLockStore } from "../../../stores/scrollLockStore";

import type { Product, PublicOrder } from "../../../types";

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

  const { data: products, isLoading: productsLoading } = useGetProductsQuery({
    per_page: 100,
    status: "publish",
  });

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

  const cartItems =
    products?.filter((product: Product) => cart[product.id] > 0).map(
      (product: Product) => ({
        ...product,
        quantity: cart[product.id],
        totalPrice: (
          parseFloat(product.sale_price || product.price || "0") *
          cart[product.id]
        ).toFixed(0),
      })
    ) || [];

  const totalAmount = cartItems.reduce(
    (sum: number, item: Product & { quantity: number; totalPrice: string }) =>
      sum + parseFloat(item.totalPrice),
    0
  );

  const totalItems = cartItems.reduce(
    (sum: number, item: Product & { quantity: number }) => sum + item.quantity,
    0
  );

  /* =========================
     CART ACTIONS
  ========================= */

  const handleAdd = (productId: number) => {
    dispatch(addToCart(productId));
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

    products,
    productsLoading,

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