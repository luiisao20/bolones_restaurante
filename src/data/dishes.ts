import type { Dish } from '../types';

export const DISHES: Dish[] = [
  // --- BOLONES Y TIGRILLOS ---
  {
    id: 'bolon-mixto',
    name: 'Bolón Mixto Especial',
    description: 'Plátano verde majado artesanalmente con abundante queso manaba tierno y chicharrón crujiente de cerdo.',
    price: 3.75,
    category: 'bolones',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Más Vendido',
    preparationTime: '8 min'
  },
  {
    id: 'bolon-queso',
    name: 'Bolón de Queso Manaba',
    description: 'Generosa bola de verde frito y amasado, rellena de auténtico queso manabita derretido al calor.',
    price: 3.25,
    category: 'bolones',
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Tradicional',
    preparationTime: '7 min'
  },
  {
    id: 'bolon-chicharron',
    name: 'Bolón de Chicharrón',
    description: 'Bolón de plátano verde con tocino y trozos de chicharrón bien tostados y dorados a la perfección.',
    price: 3.50,
    category: 'bolones',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    preparationTime: '8 min'
  },
  {
    id: 'tigrillo-zarumeno',
    name: 'Tigrillo Zarumeño Completo',
    description: 'Majado fino de plátano verde con sofrito criollo, huevo revuelto, queso criollo y chicharrón jugoso.',
    price: 4.50,
    category: 'bolones',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Especialidad',
    preparationTime: '10 min'
  },

  // --- DESAYUNOS TÍPICOS ---
  {
    id: 'desayuno-manabita',
    name: 'Desayuno Manabita con Bistec',
    description: 'Bolón mixto a elección servido con jugoso bistec de lomo de res en salsa criolla, huevo frito montado y café pasado.',
    price: 6.50,
    category: 'desayunos',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Recomendado',
    preparationTime: '12 min'
  },
  {
    id: 'patacones-queso',
    name: 'Porción de Patacones con Queso',
    description: 'Cinco patacones gruesos de verde extra crocantes acompañados de lonjas de queso manaba fresco.',
    price: 2.75,
    category: 'desayunos',
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80',
    preparationTime: '5 min'
  },

  // --- COMIDA MARINA / MARISCOS ---
  {
    id: 'encebollado-mixto',
    name: 'Encebollado Mixto (Albacora & Camarón)',
    description: 'El plato bandera: caldo espeso de albacora fresca con camarones jumbo, yuca suave, cebolla encurtida, chifles y maíz tostado.',
    price: 5.50,
    category: 'mariscos',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Orgullo Nacional',
    preparationTime: '8 min'
  },
  {
    id: 'ceviche-camaron',
    name: 'Ceviche de Camarón Tradicional',
    description: 'Camarones del Golfo cocidos en su punto con jugo de naranja y limón agrio, cilantro picado, cebolla colorada, patacones y chifles.',
    price: 6.00,
    category: 'mariscos',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Fresco del Día',
    preparationTime: '10 min'
  },
  {
    id: 'arroz-marinero',
    name: 'Arroz Marinero Costeño',
    description: 'Arroz salteado con achiote, camarón, calamar, pulpo, concha y almeja, aromatizado con perejil fresco y maduro frito.',
    price: 8.50,
    category: 'mariscos',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    badge: 'Chef Choice',
    preparationTime: '15 min'
  },
  {
    id: 'pargo-frito',
    name: 'Pargo Rojo Entero Frito',
    description: 'Pescado entero crocante marinado con ajo y comino, acompañado de patacones dorados, arroz con menestra y ensalada fresca.',
    price: 9.75,
    category: 'mariscos',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    preparationTime: '18 min'
  },
  {
    id: 'cazuela-mariscos',
    name: 'Cazuela Mixta de Mariscos',
    description: 'Cremosa masa de verde cocida en paila de barro con pasta de maní casera, pescado de roca y camarones salteados.',
    price: 7.50,
    category: 'mariscos',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    preparationTime: '14 min'
  },

  // --- PLATOS A LA CARTA ---
  {
    id: 'seco-pollo',
    name: 'Seco de Pollo con Arroz Amarillo',
    description: 'Presa tierna cocinada a fuego lento en reducción de cerveza, naranjilla y hierbas, servido con arroz, maduro dulce y aguacate.',
    price: 5.00,
    category: 'carta',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    preparationTime: '10 min'
  },
  {
    id: 'seco-chivo',
    name: 'Seco de Chivo Tradicional',
    description: 'Carne seleccionada macerada en chicha de jora y especias andinas, servido con arroz achiotado y plátano maduro.',
    price: 7.00,
    category: 'carta',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    preparationTime: '12 min'
  },
  {
    id: 'churrasco-ecuatoriano',
    name: 'Churrasco Ecuatoriano con Huevo',
    description: 'Filete de lomo fino asado cubierto con salsa criolla de pimientos, dos huevos fritos, papas fritas caseras y arroz blanco.',
    price: 6.75,
    category: 'carta',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    preparationTime: '12 min'
  },

  // --- JUGOS NATURALES ---
  {
    id: 'jugo-maracuya',
    name: 'Jugo Natural de Maracuyá',
    description: 'Fruta de la pasión fresca de la costa ecuatoriana, batido al instante, servido helado.',
    price: 1.75,
    category: 'jugos',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    preparationTime: '3 min'
  },
  {
    id: 'jugo-naranjilla',
    name: 'Jugo de Naranjilla (Lulo)',
    description: 'Refrescante néctar de pulpa pura de naranjilla silvestre, cítrico y energizante.',
    price: 1.75,
    category: 'jugos',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80',
    preparationTime: '3 min'
  },
  {
    id: 'batido-guanabana',
    name: 'Batido de Guanábana en Leche',
    description: 'Cremoso batido de pulpa de guanábana seleccionada con leche entera bien fría.',
    price: 2.25,
    category: 'jugos',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    preparationTime: '4 min'
  },
  {
    id: 'jugo-mora',
    name: 'Jugo de Mora Silvestre',
    description: 'Jugo espeso de mora andina con un toque de limón fresco.',
    price: 1.75,
    category: 'jugos',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    preparationTime: '3 min'
  },

  // --- COLAS Y BEBIDAS ---
  {
    id: 'fioravanti',
    name: 'Fioravanti Frutilla 500ml',
    description: 'La gaseosa icónica de los ecuatorianos desde 1878, sabor único a fresa/frutilla.',
    price: 1.25,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    badge: 'La Clásica',
    preparationTime: '1 min'
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola Personal 500ml',
    description: 'Botella individual bien helada.',
    price: 1.25,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    preparationTime: '1 min'
  },
  {
    id: 'guitig',
    name: 'Güitig con Gas con Rodaja de Limón',
    description: 'Agua mineral con gas volcánico natural de Machachi, servida con hielo y limón.',
    price: 1.50,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    preparationTime: '1 min'
  },

  // --- CERVEZAS ---
  {
    id: 'cerveza-pilsener',
    name: 'Pilsener Grande 600ml',
    description: 'La cerveza tradicional del Ecuador, rubia, refrescante y servida bien helada (punto de nieve).',
    price: 2.75,
    category: 'cervezas',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Bien Helada',
    preparationTime: '1 min'
  },
  {
    id: 'club-premium',
    name: 'Club Premium Platino',
    description: 'Cerveza tipo lager extra suave y equilibrada, elaborada con maltas especiales.',
    price: 3.00,
    category: 'cervezas',
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    preparationTime: '1 min'
  },
  {
    id: 'michelada-manaba',
    name: 'Michelada Criolla Especial',
    description: 'Cerveza Pilsener o Club servida en copa escarchada con sal marina gruesa, jugo de 3 limones y toque secreto de ají dulce.',
    price: 3.75,
    category: 'cervezas',
    image: 'https://images.unsplash.com/photo-1538488881523-29452b450700?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorita',
    preparationTime: '3 min'
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'todos', label: 'Todo el Menú', icon: 'UtensilsCrossed' },
  { id: 'bolones', label: 'Bolones & Tigrillos', icon: 'Flame' },
  { id: 'desayunos', label: 'Desayunos & Patacones', icon: 'Coffee' },
  { id: 'mariscos', label: 'Comida Marina', icon: 'Fish' },
  { id: 'carta', label: 'Platos a la Carta', icon: 'Soup' },
  { id: 'jugos', label: 'Jugos Naturales', icon: 'Citrus' },
  { id: 'bebidas', label: 'Colas & Bebidas', icon: 'CupSoda' },
  { id: 'cervezas', label: 'Cervezas & Micheladas', icon: 'Beer' },
] as const;
