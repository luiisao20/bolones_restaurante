import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Dish, 
  Order, 
  OrderItem, 
  OrderStatus, 
  Role, 
  User, 
  Category,
  SriInvoice,
  SriCustomer,
  PaymentMethodCode
} from '../types';
import { INITIAL_ORDERS, MOCK_USERS } from '../data/initialOrders';
import { DISHES } from '../data/dishes';
import { INITIAL_INVOICES } from '../data/initialInvoices';
import { 
  generateAccessKey, 
  generateSriXml, 
  formatSequentialNumber, 
  PAYMENT_METHODS 
} from '../utils/sriUtils';

interface RestaurantContextType {
  // Auth & Roles
  currentUser: User | null;
  activeRole: Role;
  login: (user: User) => void;
  logout: () => void;
  setActiveRole: (role: Role) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Dishes & Search
  dishes: Dish[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  filteredDishes: Dish[];

  // Cart & Current Waiter Order
  cart: OrderItem[];
  currentTable: string | number;
  setCurrentTable: (table: string | number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  generalNotes: string;
  setGeneralNotes: (notes: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (dish: Dish, notes?: string) => void;
  removeFromCart: (dishId: string) => void;
  updateCartQuantity: (dishId: string, delta: number) => void;
  updateCartItemNotes: (dishId: string, notes: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;

  // Orders Management
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  submitCurrentOrder: () => { success: boolean; error?: string; orderId?: string };
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (order: Order | null) => void;
  resetDemoData: () => void;

  // SRI Electronic Invoicing
  invoices: SriInvoice[];
  nextSequential: number;
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;
  selectedViewInvoice: SriInvoice | null;
  setSelectedViewInvoice: (invoice: SriInvoice | null) => void;
  selectedViewXml: SriInvoice | null;
  setSelectedViewXml: (invoice: SriInvoice | null) => void;
  issueSriInvoice: (params: {
    order: Order;
    customer: SriCustomer;
    paymentMethod: PaymentMethodCode;
    tip: number;
  }) => Promise<SriInvoice>;
  resendInvoiceEmail: (invoiceId: string) => boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'rincon_manabita_orders_v1';
const USER_STORAGE_KEY = 'rincon_manabita_user_v1';
const INVOICES_STORAGE_KEY = 'rincon_sri_invoices_v1';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Juan Mesero by default
    } catch {
      return MOCK_USERS[0];
    }
  });

  const [activeRole, setActiveRole] = useState<Role>(() => {
    return currentUser ? currentUser.role : 'mesero';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // SRI Invoices state
  const [invoices, setInvoices] = useState<SriInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(INVOICES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedViewInvoice, setSelectedViewInvoice] = useState<SriInvoice | null>(null);
  const [selectedViewXml, setSelectedViewXml] = useState<SriInvoice | null>(null);

  // Save invoices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Error saving invoices to localStorage', e);
    }
  }, [invoices]);

  const nextSequential = invoices.reduce((max, inv) => {
    const numPart = parseInt(inv.id.replace(/FAC-001-001-/, ''), 10);
    return !isNaN(numPart) && numPart > max ? numPart : max;
  }, 103) + 1;

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }, [orders]);

  // Save user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        setActiveRole(currentUser.role);
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }, [currentUser]);

  // Dishes & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');

  const filteredDishes = DISHES.filter((dish) => {
    const matchesCategory = selectedCategory === 'todos' || dish.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Cart / Waiter State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentTable, setCurrentTable] = useState<string | number>('1');
  const [customerName, setCustomerName] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const addToCart = (dish: Dish, notes: string = '') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dishId === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                itemTotal: (item.quantity + 1) * item.price,
                notes: notes || item.notes,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          dishId: dish.id,
          dishName: dish.name,
          price: dish.price,
          quantity: 1,
          notes,
          itemTotal: dish.price,
          image: dish.image,
        },
      ];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dishId !== dishId));
  };

  const updateCartQuantity = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dishId === dishId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: Number((newQty * item.price).toFixed(2)),
            };
          }
          return item;
        })
        .filter((item): item is OrderItem => item !== null)
    );
  };

  const updateCartItemNotes = (dishId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.dishId === dishId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setGeneralNotes('');
  };

  // Calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = Number(cart.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2));
  const cartTax = Number((cartSubtotal * 0.15).toFixed(2)); // 15% IVA Ecuador
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));

  // Orders Actions
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const submitCurrentOrder = () => {
    if (cart.length === 0) {
      return { success: false, error: 'El carrito de pedidos está vacío' };
    }
    if (!customerName.trim()) {
      return { success: false, error: 'Por favor ingresa el nombre del cliente' };
    }

    const nextOrderNumber = orders.length + 101;
    const newOrderId = `ORD-${nextOrderNumber}`;

    const newOrder: Order = {
      id: newOrderId,
      tableNumber: currentTable,
      customerName: customerName.trim(),
      waiterName: currentUser ? currentUser.name : 'Mesero General',
      items: [...cart],
      status: 'recien ordenado',
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      totalItemsCount: cartTotalCount,
      createdAt: 'Recién ingresado (ahora)',
      generalNotes: generalNotes.trim() || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);

    return { success: true, orderId: newOrderId };
  };

  const issueSriInvoice = async (params: {
    order: Order;
    customer: SriCustomer;
    paymentMethod: PaymentMethodCode;
    tip: number;
  }): Promise<SriInvoice> => {
    const seq = nextSequential;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const accessKey = generateAccessKey(now, seq);
    const invoiceId = `FAC-${formatSequentialNumber(seq)}`;
    const methodObj = PAYMENT_METHODS.find((p) => p.code === params.paymentMethod);

    const subtotal15 = params.order.subtotal;
    const tax15 = params.order.tax;
    const grandTotal = Number((subtotal15 + tax15 + params.tip).toFixed(2));

    const newInvoice: SriInvoice = {
      id: invoiceId,
      orderId: params.order.id,
      tableNumber: params.order.tableNumber,
      accessKey,
      authorizationNumber: accessKey,
      authorizationDate: formattedDate,
      environment: 'PRODUCCIÓN',
      status: 'AUTORIZADO',
      customer: params.customer,
      paymentMethod: params.paymentMethod,
      paymentMethodLabel: methodObj ? methodObj.label : 'Efectivo',
      subtotal15,
      subtotal0: 0,
      tax15,
      tip: params.tip,
      total: grandTotal,
      items: [...params.order.items],
      createdAt: formattedDate,
      emailSent: !!params.customer.email.trim(),
    };

    newInvoice.xmlContent = generateSriXml(newInvoice);

    setInvoices((prev) => [newInvoice, ...prev]);

    // Mark order as completed and invoiced
    setOrders((prev) =>
      prev.map((o) =>
        o.id === params.order.id
          ? {
              ...o,
              status: 'cliente ya canceló el pedido',
              invoiceId: newInvoice.id,
              invoiceStatus: 'FACTURADO_SRI',
            }
          : o
      )
    );

    return newInvoice;
  };

  const resendInvoiceEmail = (invoiceId: string): boolean => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, emailSent: true } : inv
      )
    );
    return true;
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    setInvoices(INITIAL_INVOICES);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
    clearCart();
  };

  const login = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentUser,
        activeRole,
        login,
        logout,
        setActiveRole,
        isLoginModalOpen,
        setIsLoginModalOpen,
        dishes: DISHES,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredDishes,
        cart,
        currentTable,
        setCurrentTable,
        customerName,
        setCustomerName,
        generalNotes,
        setGeneralNotes,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemNotes,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartTax,
        cartTotal,
        orders,
        updateOrderStatus,
        submitCurrentOrder,
        selectedReceiptOrder,
        setSelectedReceiptOrder,
        resetDemoData,
        invoices,
        nextSequential,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        selectedViewInvoice,
        setSelectedViewInvoice,
        selectedViewXml,
        setSelectedViewXml,
        issueSriInvoice,
        resendInvoiceEmail,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
