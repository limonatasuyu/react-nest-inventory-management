export interface CategoryData {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface SupplierData {
  _id: string;
  name: string;
  contactInfo: string;
  address: string;
  createdAt: Date;
}

export interface OrderData {
  _id: string;
  item: { name: string; _id: string };
  supplier: { name: string; _id: string };
  quantity: number;
  dateOrdered: Date;
  status: "failed" | "complete" | "pending";
  createdAt: Date;
}

export interface ItemData {
  _id: string;
  name: string;
  category: { name: string; _id: string };
  supplier: { name: string; _id: string };
  quantity: number;
  price: number;
  description: string;
  createdAt: Date;
}
