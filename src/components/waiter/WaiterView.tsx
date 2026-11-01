import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuGrid } from './MenuGrid';
import { CartDrawer } from './CartDrawer';
import { Hash, User, ShoppingBag } from 'lucide-react';

export const WaiterView: React.FC = () => {
  const { 
    currentTable, 
    setCurrentTable, 
    customerName, 
    setCustomerName, 
    cartTotalCount, 
    cartTotal,
    setIsCartOpen 
  } = useRestaurant();

  const tables = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="space-y-6">
      
      {/* Waiter Status / Active Order Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-3.5 sm:p-5 text-white shadow-md border border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Quick Table and Customer selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          <div className="flex items-center gap-2 bg-stone-800/90 px-3 py-2.5 rounded-xl border border-stone-700/80 shrink-0">
            <Hash className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-stone-300 font-medium">Mesa:</span>
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="bg-stone-900 text-amber-400 font-black text-sm rounded-lg px-2.5 py-1 border border-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer min-h-[36px]"
            >
              {tables.map((t) => (
                <option key={t} value={t}>Mesa #{t}</option>
              ))}
              <option value="Barra 1">Barra 1</option>
              <option value="Barra 2">Barra 2</option>
              <option value="Para Llevar">Para Llevar (Takeout)</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5 bg-stone-800/90 px-3.5 py-2.5 rounded-xl border border-stone-700/80 flex-1">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente para la orden..."
              className="bg-transparent text-white placeholder-stone-400 text-base sm:text-sm font-medium w-full focus:outline-none min-h-[36px]"
            />
          </div>
        </div>

        {/* Right: Quick Cart summary & open drawer button */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800/80">
          <div className="text-left lg:text-right">
            <p className="text-[11px] text-stone-400">Total comanda:</p>
            <p className="text-base sm:text-lg font-black text-amber-400">
              ${cartTotal.toFixed(2)} <span className="text-xs text-stone-300">USD</span>
            </p>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-extrabold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-2 min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Pedido</span>
            <span className="px-2 py-0.5 bg-stone-950 text-amber-400 rounded-full text-xs font-black">
              {cartTotalCount}
            </span>
          </button>
        </div>

      </div>

      {/* Dishes Catalog & Search */}
      <MenuGrid />

      {/* Cart Drawer */}
      <CartDrawer />

    </div>
  );
};
