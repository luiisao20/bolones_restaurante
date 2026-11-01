import type { SriInvoice } from '../types';
import { generateAccessKey, generateSriXml } from '../utils/sriUtils';

const today = new Date();
const accessKey102 = generateAccessKey(today, 102);
const accessKey103 = generateAccessKey(today, 103);

export const INITIAL_INVOICES: SriInvoice[] = [
  {
    id: 'FAC-001-001-000000102',
    orderId: 'ORD-102',
    tableNumber: 1,
    accessKey: accessKey102,
    authorizationNumber: accessKey102,
    authorizationDate: '01/11/2026 12:45:10',
    environment: 'PRODUCCIÓN',
    status: 'AUTORIZADO',
    customer: {
      identificationType: '05',
      identification: '0923847561',
      name: 'MARÍA ELENA DELGADO MENDOZA',
      email: 'm.delgado.med@gmail.com',
      phone: '0991238490',
      address: 'Cdla. Kennedy Norte Mz 102 V. 4, Guayaquil'
    },
    paymentMethod: '19',
    paymentMethodLabel: 'Tarjeta de Crédito',
    subtotal15: 13.50,
    subtotal0: 0.00,
    tax15: 2.03,
    tip: 1.35,
    total: 16.88,
    items: [
      {
        dishId: 'encebollado-mixto',
        dishName: 'Encebollado Mixto (Albacora & Camarón)',
        price: 5.50,
        quantity: 2,
        notes: 'Uno sin cilantro',
        itemTotal: 11.00
      },
      {
        dishId: 'fioravanti',
        dishName: 'Fioravanti Frutilla 500ml',
        price: 1.25,
        quantity: 2,
        notes: 'Con vasos y hielo',
        itemTotal: 2.50
      }
    ],
    createdAt: '01/11/2026 12:42:00',
    emailSent: true
  },
  {
    id: 'FAC-001-001-000000103',
    orderId: 'ORD-104',
    tableNumber: 4,
    accessKey: accessKey103,
    authorizationNumber: accessKey103,
    authorizationDate: '01/11/2026 13:10:44',
    environment: 'PRODUCCIÓN',
    status: 'AUTORIZADO',
    customer: {
      identificationType: '07',
      identification: '9999999999999',
      name: 'CONSUMIDOR FINAL',
      email: '',
      phone: '0999999999',
      address: 'Guayaquil'
    },
    paymentMethod: '01',
    paymentMethodLabel: 'Sin utilización del sistema financiero (Efectivo)',
    subtotal15: 11.25,
    subtotal0: 0.00,
    tax15: 1.69,
    tip: 0.00,
    total: 12.94,
    items: [
      {
        dishId: 'bolon-queso',
        dishName: 'Bolón de Queso Manaba',
        price: 3.25,
        quantity: 2,
        itemTotal: 6.50
      },
      {
        dishId: 'jugo-naranja',
        dishName: 'Jugo Natural de Naranja',
        price: 1.75,
        quantity: 2,
        itemTotal: 3.50
      },
      {
        dishId: 'cafe-pasado',
        dishName: 'Café Pasado de Filtro',
        price: 1.25,
        quantity: 1,
        itemTotal: 1.25
      }
    ],
    createdAt: '01/11/2026 13:08:15',
    emailSent: false
  }
];

// Attach xmlContent
INITIAL_INVOICES[0].xmlContent = generateSriXml(INITIAL_INVOICES[0]);
INITIAL_INVOICES[1].xmlContent = generateSriXml(INITIAL_INVOICES[1]);
