import React from "react";

import {
  CartHeader,
  CartList,
  CartFooter,
  CartEmpty,
} from "@/components/Cart/components";

import type { CartItem, Product } from "@/types";

interface CartStepProps {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;

  onAdd: (product: Product) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onClose: () => void;

  onNext: () => void;

  siteUrl: string;
}

export const CartStep: React.FC<CartStepProps> = ({
  items,
  totalAmount,
  totalItems,
  onAdd,
  onRemove,
  onClear,
  onClose,
  onNext,
  siteUrl,
}) => {
  return (
    <div className="flex flex-col h-full">

      <CartHeader
        totalItems={totalItems}
        onClose={onClose}
        onClearCart={onClear}
        hasItems={items.length > 0}
      />

      {items.length === 0 ? (
        <CartEmpty onClose={onClose} />
      ) : (
        <CartList
          items={items}
          onAdd={onAdd}
          onRemove={onRemove}
          siteUrl={siteUrl}
        />
      )}

      {items.length > 0 && (
        <CartFooter
          totalAmount={totalAmount}
          onCheckout={onNext} // 👉 переход к checkout
        />
      )}
    </div>
  );
};