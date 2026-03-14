/* =========================
   CUSTOMER ADDRESS
========================= */

export type CustomerAddress = {
  first_name: string;
  last_name: string;

  company?: string;

  address_1: string;
  address_2?: string;

  city: string;
  postcode: string;
  country: string;

  email?: string;
  phone?: string;
};


/* =========================
   CUSTOMER MODEL
========================= */

export type Customer = {
  id: string;

  date_created: string;
  date_modified: string;

  email: string;

  first_name: string;
  last_name: string;

  role: string;
  username: string;

  billing: CustomerAddress;
  shipping: CustomerAddress;

  orders_count: number;
  total_spent: string;
};


/* =========================
   CUSTOMER DATA (LOCAL)
========================= */

export type CustomerData = {
  first_name: string;
  phone: string;
  address: string;
};


/* =========================
   AUTH RESPONSE
========================= */

export type LoginResponse = {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
};