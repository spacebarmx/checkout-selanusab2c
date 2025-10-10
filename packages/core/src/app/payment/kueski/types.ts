export interface PaymentIntent {
  order_id: string;
  description: string;
  amount: Amount;
  items?: Item[];
  shipping?: Shipping;
  callbacks?: Callbacks;
}

export interface Amount {
  total: number;
  currency: string;
  details?: Details;
}

export interface Details {
  subtotal: number;
  shipping?: number;
  tax?: number;
}

export interface Callbacks {
  on_success?: string;
  on_reject?: string;
  on_canceled?: string;
  on_failed?: string;
}

export interface Item {
  name: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
  tax?: string;
  sku?: string;
}

export interface Shipping {
  name: Name;
  address: Address;
  phone_number?: string;
  email?: string;
  type?: string;
}

export interface Address {
  address: string;
  interior?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface Name {
  name?: string;
  last: string;
}

export interface PaymentResponse {
  status: string;
  data: Payment;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  name: string;
  callback_url: string;
}
