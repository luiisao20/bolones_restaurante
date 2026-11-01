import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { OrderStatus } from '../../types';
import { InvoicesListTab } from './InvoicesListTab';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Search, 
  Receipt, 
  CheckCircle2, 
  Flame, 
  AlertCircle, 
  CheckCheck,
  Hash,
  UtensilsCrossed,
  RotateCcw,
  Plus,
  ShieldCheck
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    setSelectedReceiptOrder, 
    setActiveRole, 
    resetDemoData,
    invoices,
    setSelectedInvoiceOrder,
    setSelectedViewInvoice
  } = useRestaurant();

  const [adminTab, setAdminTab] = useState<'orders' | 'invoices'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.totalItemsCount, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'recien ordenado' || o.status === 'preparando' || o.status === 'en mesa'
  ).length;
  const completedOrdersCount = orders.filter(
    (o) => o.status === 'cliente ya canceló el pedido'
  ).length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      order.customerName.toLowerCase().includes(q) ||
      order.tableNumber.toString().toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q) ||
      order.items.some((i) => i.dishName.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recien ordenado':
        return {
          label: 'Recién Ordenado',
          className: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'preparando':
        return {
          label: 'Preparando',
          className: 'bg-orange-100 text-orange-900 border-orange-300',
          icon: <Flame className="w-3.5 h-3.5 text-orange-600" />
        };
      case 'en mesa':
        return {
          label: 'En Mesa',
          className: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'cliente ya canceló el pedido':
        return {
          label: 'Cliente ya canceló (Pagado)',
          className: 'bg-stone-200 text-stone-700 border-stone-300',
          icon: <CheckCheck className="w-3.5 h-3.5 text-stone-600" />
        };
    }
  };

  // Tables map for visual occupancy
  const allTables = ['1', '2', '3', '4', '5', '6', 'Barra 1', 'Barra 2'];
  const tableOccupancy = allTables.map((tbl) => {
    const activeOrder = orders.find(
      (o) => o.tableNumber.toString() === tbl && o.status !== 'cliente ya canceló el pedido'
    );
    return {
      table: tbl,
      order: activeOrder,
      isOccupied: !!activeOrder
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Panel de Administración & Caja</h1>
            <p className="text-xs text-stone-400">
              Control de ingresos, facturación, mesas y comensales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveRole('mesero')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido (Mesero)</span>
          </button>
          <button
            onClick={resetDemoData}
            className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold border border-stone-700 transition flex items-center gap-1.5"
            title="Restablecer datos quemados de demostración"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer Demo</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Orders vs SRI Billing) */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center gap-2 border-b-2 ${
            adminTab === 'orders'
              ? 'border-amber-500 bg-white text-stone-900 shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          <span>Gestión de Pedidos & Mesas</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('invoices')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition flex items-center gap-2 border-b-2 ${
            adminTab === 'invoices'
              ? 'border-emerald-600 bg-white text-stone-900 shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Facturación Electrónica SRI (Ecuador)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            {invoices.length} facturas
          </span>
        </button>
      </div>

      {adminTab === 'invoices' ? (
        <InvoicesListTab />
      ) : (
        <>
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Venta Total Recibos</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">${totalRevenue.toFixed(2)}</p>
            <p className="text-[11px] text-stone-500">Dólares americanos (USD)</p>
          </div>
        </div>

        {/* Card 2: Active Tables / Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Mesas / Órdenes Activas</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">{activeOrdersCount}</p>
            <p className="text-[11px] text-stone-500">En preparación o servidos en mesa</p>
          </div>
        </div>

        {/* Card 3: Items Sold */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Platillos Servidos</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">{totalItemsSold} unidades</p>
            <p className="text-[11px] text-stone-500">Bolones, mariscos, jugos y bebidas</p>
          </div>
        </div>

        {/* Card 4: Orders closed/paid */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pedidos Cancelados/Cerrados</span>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <CheckCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">{completedOrdersCount}</p>
            <p className="text-[11px] text-stone-500">Clientes que ya cancelaron la cuenta</p>
          </div>
        </div>

      </div>

      {/* Visual Table Occupancy Map */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-amber-600" />
            Mapa de Mesas en Vivo
          </h2>
          <span className="text-xs text-stone-500">
            {tableOccupancy.filter((t) => t.isOccupied).length} ocupadas / {allTables.length} totales
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {tableOccupancy.map(({ table, order, isOccupied }) => (
            <div
              key={table}
              onClick={() => {
                if (order) setSelectedReceiptOrder(order);
              }}
              className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                isOccupied
                  ? 'bg-amber-50 border-amber-300 hover:border-amber-500 hover:shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
              }`}
            >
              <div>
                <p className="font-black text-xs text-stone-900">
                  {table.startsWith('Barra') ? table : `Mesa ${table}`}
                </p>
                {isOccupied && order ? (
                  <p className="text-[10px] font-bold text-amber-800 line-clamp-1 mt-0.5">
                    {order.customerName}
                  </p>
                ) : (
                  <p className="text-[10px] text-stone-400 mt-0.5">Libre</p>
                )}
              </div>

              {isOccupied && order && (
                <div className="mt-2 pt-1 border-t border-amber-200/80 text-[10px] font-bold text-stone-900">
                  ${order.total.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Orders Table & Controls */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4">
        
        {/* Search & Status Filters */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, mesa, comanda o platillo..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {(['todos', 'recien ordenado', 'preparando', 'en mesa', 'cliente ya canceló el pedido'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === status
                    ? 'bg-stone-900 text-white shadow'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {status === 'todos' ? 'Todos' : status}
              </button>
            ))}
          </div>

        </div>

        {/* Mobile View: Cards */}
        <div className="divide-y divide-stone-200/80 md:hidden">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div key={order.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-stone-900 text-amber-400 rounded-md font-black text-xs">
                      {typeof order.tableNumber === 'number' || !order.tableNumber.includes(' ')
                        ? `Mesa ${order.tableNumber}`
                        : order.tableNumber}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-xs">#{order.id}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.className}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-stone-900 text-sm">{order.customerName}</p>
                    <p className="text-[11px] text-stone-500">Mesero: {order.waiterName} • {order.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-600 block">${order.total.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400">c/ IVA 15%</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pb-1 border-b border-stone-200/60">
                    <span>Platillos ({order.totalItemsCount} items)</span>
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span><strong className="text-stone-900">{item.quantity}x</strong> {item.dishName}</span>
                        <span className="font-semibold text-stone-800">${item.itemTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Actions & Status Select */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-2 py-2 text-stone-800 font-bold focus:outline-none min-h-[40px] flex-1"
                  >
                    <option value="recien ordenado">Recién ordenado</option>
                    <option value="preparando">Preparando</option>
                    <option value="en mesa">En mesa</option>
                    <option value="cliente ya canceló el pedido">Cliente ya canceló</option>
                  </select>

                  <button
                    onClick={() => setSelectedReceiptOrder(order)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold text-xs transition flex items-center gap-1 min-h-[40px] active:scale-95"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Recibo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table for Tablets & Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/80 text-stone-600 font-bold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Comanda / ID</th>
                <th className="py-3 px-4">Mesa</th>
                <th className="py-3 px-4">Nombre del Cliente</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Platillos Ordenados</th>
                <th className="py-3 px-4">Estado de la Orden</th>
                <th className="py-3 px-4 text-right">Total Recibo</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 text-stone-800">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);

                return (
                  <tr key={order.id} className="hover:bg-amber-50/40 transition">
                    
                    {/* ID & Time */}
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      <div>#{order.id}</div>
                      <span className="text-[10px] text-stone-400 font-normal">{order.createdAt}</span>
                    </td>

                    {/* Table */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-stone-900 text-amber-400 rounded-md font-black text-xs">
                        {typeof order.tableNumber === 'number' || !order.tableNumber.includes(' ')
                          ? `Mesa ${order.tableNumber}`
                          : order.tableNumber}
                      </span>
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {order.customerName}
                      <span className="block text-[10px] font-normal text-stone-500">
                        Mesero: {order.waiterName}
                      </span>
                    </td>

                    {/* Number of Items */}
                    <td className="py-3 px-4">
                      <span className="font-extrabold px-2 py-1 bg-stone-100 rounded-lg text-stone-900 border border-stone-200">
                        {order.totalItemsCount} items
                      </span>
                    </td>

                    {/* Dishes summary */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-stone-700 truncate">
                            <span className="font-bold text-stone-900">{item.quantity}x</span> {item.dishName}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status with Badge and fast selector */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.className}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                        <div>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-[10px] bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5 text-stone-700 font-medium focus:outline-none"
                          >
                            <option value="recien ordenado">Recién ordenado</option>
                            <option value="preparando">Preparando</option>
                            <option value="en mesa">En mesa</option>
                            <option value="cliente ya canceló el pedido">Cliente ya canceló</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Total Recibo */}
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-black text-amber-600 block">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-stone-400">c/ IVA 15%</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.invoiceStatus === 'FACTURADO_SRI' || invoices.some(i => i.orderId === order.id) ? (
                          <button
                            onClick={() => {
                              const found = invoices.find(i => i.orderId === order.id);
                              if (found) setSelectedViewInvoice(found);
                            }}
                            className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                            title="Ver RIDE oficial de la factura electrónica emitida"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>RIDE SRI</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                            title="Emitir factura electrónica SRI para este pedido"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Facturar SRI</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-2 py-1.5 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-700 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                          title="Ver recibo / pre-cuenta"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Recibo</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-stone-500 text-xs">
            No se encontraron pedidos con los criterios actuales.
          </div>
        )}

      </div>
    </>
  )}

    </div>
  );
};
