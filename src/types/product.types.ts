/* =========================
   PRODUCT IMAGE
========================= */

export type ProductImage = {
  id: number;
  src: string;
  name: string;
  alt: string;
};

/* =========================
   PRODUCT CATEGORY
========================= */

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count?: number;
};

/* =========================
   PRODUCT TAG
========================= */

export type ProductTag = {
  id: number;
  name: string;
  slug: string;
};

/* =========================
   PRODUCT STATUS
========================= */

export type ProductStatus =
  | "hit"
  | "new"
  | "sale"
  | "none";

/* =========================
   PRODUCT MODEL
========================= */

export type Product = {
  id: number;

  name: string;
  slug: string;
  permalink: string;

  type: string;
  status: string;

  featured: boolean;
  catalog_visibility: string;

  description: string;
  short_description: string;

  sku: string;

  price: string;
  regular_price: string;
  sale_price: string;

  weight?: string | number;

  date_created: string;
  date_modified: string;

  stock_status: string;
  stock_quantity: number | null;

  menu_order?: number;
  total_sales?: number;

  images: ProductImage[];

  categories: Category[];

  tags?: ProductTag[];
};