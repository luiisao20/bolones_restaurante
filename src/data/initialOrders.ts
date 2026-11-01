import type { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    tableNumber: 3,
    customerName: 'Carlos Zambrano',
    waiterName: 'Juan Mesero',
    status: 'recien ordenado',
    items: [
      {
        dishId: 'bolon-mixto',
        dishName: 'Bolón Mixto Especial',
        price: 3.75,
        quantity: 2,
        notes: 'Chicharrón bien tostado, por favor',
        itemTotal: 7.50,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'jugo-maracuya',
        dishName: 'Jugo Natural de Maracuyá',
        price: 1.75,
        quantity: 2,
        notes: 'Bien frío con poco azúcar',
        itemTotal: 3.50,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItemsCount: 4,
    subtotal: 11.00,
    tax: 1.65,
    total: 12.65,
    createdAt: 'Hace 4 minutos',
    generalNotes: 'Mesa exterior cerca del balcón'
  },
  {
    id: 'ORD-102',
    tableNumber: 1,
    customerName: 'Dra. María Elena Delgado',
    waiterName: 'Juan Mesero',
    status: 'preparando',
    items: [
      {
        dishId: 'encebollado-mixto',
        dishName: 'Encebollado Mixto (Albacora & Camarón)',
        price: 5.50,
        quantity: 2,
        notes: 'Uno sin cilantro',
        itemTotal: 11.00,
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'fioravanti',
        dishName: 'Fioravanti Frutilla 500ml',
        price: 1.25,
        quantity: 2,
        notes: 'Con vasos y hielo',
        itemTotal: 2.50,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'patacones-queso',
        dishName: 'Porción de Patacones con Queso',
        price: 2.75,
        quantity: 1,
        itemTotal: 2.75,
        image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItemsCount: 5,
    subtotal: 16.25,
    tax: 2.44,
    total: 18.69,
    createdAt: 'Hace 12 minutos'
  },
  {
    id: 'ORD-103',
    tableNumber: 5,
    customerName: 'Familia Mendoza',
    waiterName: 'Lucía Mesera',
    status: 'en mesa',
    items: [
      {
        dishId: 'arroz-marinero',
        dishName: 'Arroz Marinero Costeño',
        price: 8.50,
        quantity: 2,
        itemTotal: 17.00,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'cerveza-pilsener',
        dishName: 'Pilsener Grande 600ml',
        price: 2.75,
        quantity: 3,
        itemTotal: 8.25,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'michelada-manaba',
        dishName: 'Michelada Criolla Especial',
        price: 3.75,
        quantity: 1,
        itemTotal: 3.75,
        image: 'https://images.unsplash.com/photo-1538488881523-29452b450700?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItemsCount: 6,
    subtotal: 29.00,
    tax: 4.35,
    total: 33.35,
    createdAt: 'Hace 28 minutos',
    generalNotes: 'Pidieron cuenta tentativa'
  },
  {
    id: 'ORD-104',
    tableNumber: 2,
    customerName: 'Roberto Alava',
    waiterName: 'Juan Mesero',
    status: 'cliente ya canceló el pedido',
    items: [
      {
        dishId: 'desayuno-manabita',
        dishName: 'Desayuno Manabita con Bistec',
        price: 6.50,
        quantity: 1,
        itemTotal: 6.50,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
      },
      {
        dishId: 'batido-guanabana',
        dishName: 'Batido de Guanábana en Leche',
        price: 2.25,
        quantity: 1,
        itemTotal: 2.25,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItemsCount: 2,
    subtotal: 8.75,
    tax: 1.31,
    total: 10.06,
    createdAt: 'Hace 45 minutos (Cancelado/Pagado)'
  }
];

export const MOCK_USERS = [
  {
    id: 'usr-1',
    name: 'Juan Mesero',
    role: 'mesero' as const,
    title: 'Mesero de Salón',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-2',
    name: 'Don Lucho (Jefe de Cocina)',
    role: 'cocina' as const,
    title: 'Chef Principal',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-3',
    name: 'Doña Carmen',
    role: 'admin' as const,
    title: 'Administradora & Gerencia',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  }
];
