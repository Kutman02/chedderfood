import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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

import type { Product, Category } from "../../../types";

export const useHomeLogic = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((s) => s.cart.items);
  const isCartOpen = useAppSelector((s) => s.ui.isCartOpen);
  const isReceiptsOpen = useAppSelector((s) => s.ui.isReceiptsOpen);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API
  const { data: products, isLoading: productsLoading } =
    useGetPublicProductsQuery({
      per_page: 100,
      status: "publish",
    });

  const { data: categories, isLoading: categoriesLoading } =
    useGetPublicProductCategoriesQuery({
      per_page: 100,
    });

  // Группировка товаров
  const productsByCategory = useMemo(() => {
    if (!products || !categories) return {};

    const grouped: { [key: number]: Product[] } = {};

    categories.forEach((category: Category) => {
      grouped[category.id] = [];
    });

    products.forEach((product: Product) => {
      if (product.categories?.length) {
        const category = product.categories[0];

        if (grouped[category.id]) {
          grouped[category.id].push(product);
        }
      }
    });

    Object.keys(grouped).forEach((id) => {
      grouped[Number(id)].sort((a, b) => {
        const orderA = a.menu_order || 0;
        const orderB = b.menu_order || 0;

        return orderA - orderB;
      });
    });

    return grouped;
  }, [products, categories]);

  // cart
  const addToCart = (productId: number) => {
    dispatch(addToCartAction(productId));
  };

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId));
  };

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }, [cart]);

  // URL sync
  useEffect(() => {
    const modal = searchParams.get("modal");
    const productId = searchParams.get("productId");

    if (modal === "cart" && !isCartOpen) {
      dispatch(openCart());
    }

    if ((modal === "receipts" || modal === "mycheks") && !isReceiptsOpen) {
      dispatch(openReceipts());
    }

    if (modal === "product" && productId && products) {
      const product = products.find((p : Product) => p.id === Number(productId));

      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    }

    if (!modal) {
      dispatch(closeCart());
      dispatch(closeReceipts());
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  }, [searchParams, dispatch, products, isCartOpen, isReceiptsOpen]);

  // открыть товар
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    const params = new URLSearchParams(searchParams);

    params.set("modal", "product");
    params.set("productId", String(product.id));

    setSearchParams(params);
  };

  // закрыть товар
  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);

    const params = new URLSearchParams(searchParams);

    params.delete("modal");
    params.delete("productId");

    setSearchParams(params);
  };

  // закрыть чеки
  const closeReceiptsHandler = () => {
    dispatch(closeReceipts());

    const params = new URLSearchParams(searchParams);

    params.delete("modal");

    setSearchParams(params);
  };

  return {
    products,
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