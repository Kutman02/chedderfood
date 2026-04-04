import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { normalizeProduct } from "@/utils/normalizeProduct";

import {
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery,
} from "../../../app/services/publicApi";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from "../../../app/slices/cartSlice";

import {
  closeReceipts,
  openCart,
  openReceipts,
  closeCart,
} from "../../../app/slices/uiSlice";

import type { Product } from "../../../types";

export const useHomeLogic = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((s) => s.cart.items);
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);
  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =========================
     API
  ========================= */

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useGetPublicProductsQuery({
    per_page: 100,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetPublicProductCategoriesQuery({
    per_page: 100,
  });

  /* =========================
     DEBUG
  ========================= */

  useEffect(() => {
    console.log("=== DEBUG API ===");
    console.log("products:", products);
    console.log("categories:", categories);
    console.log("productsError:", productsError);
    console.log("categoriesError:", categoriesError);
  }, [products, categories, productsError, categoriesError]);

  /* =========================
     NORMALIZATION
  ========================= */

  const normalizedProducts = useMemo(() => {
    return products.map(normalizeProduct);
  }, [products]);

  /* =========================
     GROUPING
  ========================= */

  const productsByCategory = useMemo(() => {
    const grouped: Record<number, Product[]> = {};

    normalizedProducts.forEach((product) => {
      if (!product.categories?.length) return;

      product.categories.forEach((cat) => {
        if (!grouped[cat.id]) {
          grouped[cat.id] = [];
        }

        grouped[cat.id].push(product);
      });
    });

    // сортировка
    Object.keys(grouped).forEach((id) => {
      grouped[Number(id)].sort((a, b) => {
        return (a.menu_order || 0) - (b.menu_order || 0);
      });
    });

    return grouped;
  }, [normalizedProducts]);

  /* =========================
     DEBUG GROUPING
  ========================= */

  useEffect(() => {
    console.log("=== DEBUG GROUPED ===");
    console.log("productsByCategory:", productsByCategory);
  }, [productsByCategory]);

  /* =========================
     CART
  ========================= */

  const addToCart = (product: Product) => {
    dispatch(addToCartAction(product));
  };

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId));
  };

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  /* =========================
     URL SYNC
  ========================= */

  useEffect(() => {
    const modal = searchParams.get("modal");
    const productId = searchParams.get("productId");

    if (modal === "cart") {
      dispatch(openCart());
      dispatch(closeReceipts());
    } else if (modal === "receipts" || modal === "mycheks") {
      dispatch(closeCart());
      dispatch(openReceipts());
    } 
    // 🔥 ВАЖНО: используем normalizedProducts
    else if (modal === "product" && productId && normalizedProducts.length) {
      const product = normalizedProducts.find(
        (p) => p.id === Number(productId)
      );

      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    } else {
      dispatch(closeCart());
      dispatch(closeReceipts());
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  }, [searchParams, dispatch, normalizedProducts]);

  /* =========================
     MODAL
  ========================= */

  const openProductModal = (product: Product) => {
    const normalized = normalizeProduct(product);

    setSelectedProduct(normalized);
    setIsModalOpen(true);

    const params = new URLSearchParams(searchParams);

    params.set("modal", "product");
    params.set("productId", String(product.id));

    setSearchParams(params);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);

    const params = new URLSearchParams(searchParams);

    params.delete("modal");
    params.delete("productId");

    setSearchParams(params);
  };

  const closeReceiptsHandler = () => {
    dispatch(closeReceipts());

    const params = new URLSearchParams(searchParams);
    params.delete("modal");

    setSearchParams(params);
  };

  /* =========================
     RETURN
  ========================= */

  return {
    products: normalizedProducts, // 🔥 возвращаем уже нормализованные
    categories,

    productsLoading,
    categoriesLoading,

    productsByCategory,

    addToCart,
    removeFromCart,

    cartCount,
    isCartOpen,
    isReceiptsOpen,

    selectedProduct,
    isModalOpen,

    openProductModal,
    closeProductModal,

    closeReceipts: closeReceiptsHandler,
  };
};