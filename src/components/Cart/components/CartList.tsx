import React from "react";
import type { CartItem } from "@/types";

import { CartItemCard } from "./CartItemCard";

interface CartListProps {
  items: CartItem[];
  onAdd: (product: CartItem) => void;
  onRemove: (productId: number) => void;
  siteUrl: string;
}

export const CartList: React.FC<CartListProps> = ({
  items,
  onAdd,
  onRemove,
  siteUrl,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 md:p-6 pb-32 md:pb-6">
      <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">

        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onAdd={() => onAdd(item)}
            onRemove={() => onRemove(item.id)}
            siteUrl={siteUrl}
          />
        ))}

      </div>
    </div>
  );
};