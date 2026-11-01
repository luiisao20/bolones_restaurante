export type Category = 
  | 'todos'
  | 'bolones'
  | 'mariscos'
  | 'carta'
  | 'desayunos'
  | 'jugos'
  | 'bebidas'
  | 'cervezas';

export type OrderStatus = 
  | 'recien ordenado' 
  | 'preparando' 
  | 'en mesa' 
  | 'cliente ya canceló el pedido';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'todos'>;
  image: string;
  isPopular?: boolean;
  preparationTime?: string;
  badge?: string;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  notes?: string;
  itemTotal: number;
  image?: string;
}

export interface Order {
  id: string;
  tableNumber: string | number;
  customerName: string;
  waiterName: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  totalItemsCount: number;
  createdAt: string;
  generalNotes?: string;
  invoiceId?: string;
  invoiceStatus?: 'NO_FACTURADO' | 'FACTURADO_SRI';
}

export type IdentificationType = 
  | '04' // RUC
  | '05' // Cédula
  | '06' // Pasaporte
  | '07' // Consumidor Final
  | '08'; // Identificación del Exterior

export type PaymentMethodCode = 
  | '01' // Sin utilización del sistema financiero (Efectivo)
  | '16' // Tarjeta de Débito
  | '19' // Tarjeta de Crédito
  | '20' // Otros con utilización del sistema financiero (Transferencia / QR)
  | '17'; // Dinero Electrónico

export interface SriCustomer {
  identificationType: IdentificationType;
  identification: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface SriInvoice {
  id: string; // e.g. FAC-001-001-000000104
  orderId: string;
  tableNumber: string | number;
  accessKey: string; // 49 digits
  authorizationNumber: string;
  authorizationDate: string;
  environment: 'PRUEBAS' | 'PRODUCCIÓN';
  status: 'AUTORIZADO' | 'DEVUELTO' | 'PENDIENTE';
  customer: SriCustomer;
  paymentMethod: PaymentMethodCode;
  paymentMethodLabel: string;
  subtotal15: number;
  subtotal0: number;
  tax15: number;
  tip: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  xmlContent?: string;
  emailSent: boolean;
}

export type Role = 'mesero' | 'cocina' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  title: string;
}
