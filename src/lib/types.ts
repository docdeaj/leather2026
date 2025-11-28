
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'Published' | 'Draft';
  image: string;
  images?: string[];
  description: string;
  reviews?: { rating: number; text: string; author: string }[];
  sku: string;
  ownerId?: string;
};

export type CartItem = {
  id: string; // This will be the product ID
  quantity: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
};

export type Order = {
  id: string;
  customerId: string;
  orderDate: any; // Using 'any' for Firestore ServerTimestamp
  amount: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  items?: OrderItem[]; // This is a subcollection, so it may not be on the main document
  ownerId: string;
};

export type PurchaseOrderItem = {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export type PurchaseOrder = {
  id: string;
  supplierId: string;
  poNumber: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Received' | 'Cancelled';
  expectedDelivery: any; // Can be a server timestamp
  items?: PurchaseOrderItem[];
  ownerId?: string;
}

export type User = {
    id: string;
    firstName: string;
    lastName:string;
    email: string;
    phone?: string;
    role: 'Admin' | 'Manager' | 'Accountant' | 'Cashier' | 'Customer';
    lastActive: string; // ISO date string
    status: 'Active' | 'Inactive' | 'Invited';
};

export type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
}

export type Supplier = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export type Account = {
  id: string;
  accountNumber: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
};

export type Invoice = {
  id: string;
  orderId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: any; // Using any for Date or serverTimestamp
  dueDate: any; // Using any for Date or serverTimestamp
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';
  ownerId?: string;
};

export type Expense = {
    id: string;
    description: string;
    category: string;
    amount: number;
    dueDate: any; // Can be a server timestamp
    status: 'Pending' | 'Paid' | 'Overdue';
    paymentMethod?: 'Cash' | 'Card' | 'Cheque';
    ownerId?: string;
};
    
export type Cheque = {
  id: string;
  chequeNumber: string;
  amount: number;
  bank: string;
  date: any; // Can be a server timestamp
  dueDate: any; // Can be a server timestamp
  status: 'Received' | 'Deposited' | 'Cleared' | 'Bounced';
  drawer: string;
  purpose: string;
  ownerId?: string;
};
