import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { Order, OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  CheckCircle2, 
  CheckCheck, 
  AlertCircle, 
  Search,
  Hash,
  User,
  ShoppingBag
} from 'lucide-react';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus, setSelectedReceiptOrder, setActiveRole } = useRestaurant();
  const [kitchenSearch, setKitchenSearch] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus | 'todos'>('todos');

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'todos' || order.status === activeTab;
    const q = kitchenSearch.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      order.customerName.toLowerCase().includes(q) ||
      order.tableNumber.toString().toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q) ||
      order.items.some((i) => i.dishName.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recien ordenado':
        return {
          label: 'Recién Ordenado',
          color: 'bg-amber-500 text-stone-950 border-amber-600',
          dot: 'bg-amber-400 animate-ping',
          icon: <AlertCircle className="w-3.5 h-3.5" />
        };
      case 'preparando':
        return {
          label: 'Preparando en Cocina',
          color: 'bg-orange-500 text-white border-orange-600',
          dot: 'bg-orange-300 animate-pulse',
          icon: <Flame className="w-3.5 h-3.5" />
        };
      case 'en mesa':
        return {
          label: 'En Mesa (Servido)',
          color: 'bg-emerald-600 text-white border-emerald-700',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'cliente ya canceló el pedido':
        return {
          label: 'Cliente ya Canceló el Pedido',
          color: 'bg-stone-600 text-stone-200 border-stone-700',
          dot: 'bg-stone-400',
          icon: <CheckCheck className="w-3.5 h-3.5" />
        };
    }
  };

  const getNextStatusAction = (order: Order) => {
    switch (order.status) {
      case 'recien ordenado':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'preparando')}
            className="w-full py-3 px-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[46px]"
          >
            <Flame className="w-4 h-4" />
            <span>Comenzar a Preparar</span>
          </button>
        );
      case 'preparando':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'en mesa')}
            className="w-full py-3 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[46px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Listo - Servir en Mesa</span>
          </button>
        );
      case 'en mesa':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => updateOrderStatus(order.id, 'cliente ya canceló el pedido')}
              className="flex-1 py-3 px-3 bg-stone-800 hover:bg-stone-900 active:scale-95 text-amber-400 font-extrabold rounded-xl text-xs sm:text-sm shadow transition flex items-center justify-center gap-1.5 border border-stone-700 min-h-[46px]"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Cliente Ya Canceló (Cobrado)</span>
            </button>
            <button
              onClick={() => {
                setSelectedReceiptOrder(order);
              }}
              className="px-3.5 py-3 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 rounded-xl text-xs font-bold transition min-h-[46px]"
              title="Ver cuenta/recibo"
            >
              Recibo
            </button>
          </div>
        );
      case 'cliente ya canceló el pedido':
        return (
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium p-1">
            <span className="flex items-center gap-1 text-stone-500">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Cuenta saldada y cerrada
            </span>
            <button
              onClick={() => setSelectedReceiptOrder(order)}
              className="text-amber-700 hover:underline font-bold text-xs"
            >
              Ver Recibo
            </button>
          </div>
        );
    }
  };

  const countsByStatus = {
    recienOrdenado: orders.filter((o) => o.status === 'recien ordenado').length,
    preparando: orders.filter((o) => o.status === 'preparando').length,
    enMesa: orders.filter((o) => o.status === 'en mesa').length,
    cancelado: orders.filter((o) => o.status === 'cliente ya canceló el pedido').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Kitchen Display Banner */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Pantalla de Cocina (KDS)
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Tiempo Real
              </span>
            </h1>
            <p className="text-xs text-stone-400">
              Control de comanda para cocineros y despachadores
            </p>
          </div>
        </div>

        {/* Status Metrics Counters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('recien ordenado')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              activeTab === 'recien ordenado'
                ? 'bg-amber-500 text-stone-950 border-amber-600'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Recién Ordenados:</span>
            <span className="font-black">{countsByStatus.recienOrdenado}</span>
          </button>

          <button
            onClick={() => setActiveTab('preparando')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              activeTab === 'preparando'
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>En Cocina:</span>
            <span className="font-black">{countsByStatus.preparando}</span>
          </button>

          <button
            onClick={() => setActiveTab('en mesa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              activeTab === 'en mesa'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>En Mesa:</span>
            <span className="font-black">{countsByStatus.enMesa}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={kitchenSearch}
            onChange={(e) => setKitchenSearch(e.target.value)}
            placeholder="Buscar por cliente, mesa o platillo..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['todos', 'recien ordenado', 'preparando', 'en mesa', 'cliente ya canceló el pedido'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-stone-900 text-white shadow'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab === 'todos' ? 'Todas las Órdenes' : tab.toUpperCase()}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border-2 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md ${
                order.status === 'recien ordenado'
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : order.status === 'preparando'
                  ? 'border-orange-400 ring-2 ring-orange-400/20'
                  : order.status === 'en mesa'
                  ? 'border-emerald-300'
                  : 'border-stone-200 opacity-80'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-stone-50 border-b border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  {/* Table identifier */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-stone-900 text-amber-400 font-black text-sm rounded-lg shadow-xs flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      {typeof order.tableNumber === 'number' || !order.tableNumber.includes(' ')
                        ? `MESA ${order.tableNumber}`
                        : order.tableNumber.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      #{order.id}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-2xs ${badge.color}`}>
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Customer name and Waiter name */}
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>{order.customerName}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {order.createdAt}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-4 space-y-3 flex-1">
                {/* Total items banner */}
                <div className="flex items-center justify-between bg-stone-100/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    Total de platillos:
                  </span>
                  <span className="font-extrabold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {order.totalItemsCount} items
                  </span>
                </div>

                {/* Items detail list */}
                <div className="divide-y divide-stone-100 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                            {item.quantity}x
                          </span>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                              {item.dishName}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Unitario: ${item.price.toFixed(2)} USD
                            </p>
                          </div>
                        </div>

                        {/* Estimated Subtotal for each dish */}
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-stone-400">Total est.:</p>
                          <p className="text-xs font-black text-stone-800">
                            ${item.itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Item specific notes */}
                      {item.notes && (
                        <div className="ml-8 text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200/80 font-medium">
                          <strong>Nota cocina:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* General notes if any */}
                {order.generalNotes && (
                  <div className="text-xs bg-stone-100 text-stone-700 p-2 rounded-lg border border-stone-200 mt-2">
                    <span className="font-bold text-stone-900">Nota de mesa:</span> {order.generalNotes}
                  </div>
                )}
              </div>

              {/* Card Footer with Total & Status Action Button */}
              <div className="p-4 bg-stone-50/90 border-t border-stone-200 space-y-3">
                {/* Total Recibo */}
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Total Recibo (c/IVA 15%):</span>
                  <span className="text-base font-black text-amber-600">
                    ${order.total.toFixed(2)} USD
                  </span>
                </div>

                {/* Next status action */}
                <div>
                  {getNextStatusAction(order)}
                </div>

                {/* Secondary status changer */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Cambiar estado a:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-white border border-stone-300 rounded px-1.5 py-0.5 text-[11px] font-bold text-stone-800 focus:outline-none"
                  >
                    <option value="recien ordenado">Recién ordenado</option>
                    <option value="preparando">Preparando</option>
                    <option value="en mesa">En mesa</option>
                    <option value="cliente ya canceló el pedido">Cliente ya canceló</option>
                  </select>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500 space-y-3">
          <ChefHat className="w-12 h-12 mx-auto text-stone-300" />
          <h3 className="text-base font-bold text-stone-700">No hay órdenes en este estado</h3>
          <p className="text-xs text-stone-400">
            Puedes cambiar a la vista de Mesero para registrar nuevos pedidos.
          </p>
          <button
            onClick={() => setActiveRole('mesero')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition shadow"
          >
            Ir a Tomar Pedidos (Mesero) →
          </button>
        </div>
      )}

    </div>
  );
};
