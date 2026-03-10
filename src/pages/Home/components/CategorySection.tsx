import type { Product, Category } from "../../../types";
import { ProductCard } from "./ProductCard";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const CategorySection = ({
  category,
  products,
  onProductClick,
}: CategorySectionProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Заголовок категории */}
      <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
        {category.name}
      </h2>

      {/* Сетка товаров */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            productIndex={index}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </section>
  );
};