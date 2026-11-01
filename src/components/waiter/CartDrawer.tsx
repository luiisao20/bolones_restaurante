import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  Utensils, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  User,
  FileText
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    currentTable,
    setCurrentTable,
    customerName,
    setCustomerName,
    generalNotes,
    setGeneralNotes,
    updateCartQuantity,
    updateCartItemNotes,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    submitCurrentOrder,
    setActiveRole
  } = useRestaurant();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isCartOpen) return null;

  const quickTables = ['1', '2', '3', '4', '5', '6', 'Barra 1', 'Para Llevar'];

  const handleSubmit = () => {
    const res = submitCurrentOrder();
    if (!res.success) {
      setNotification({ message: res.error || 'Ocurrió un error al enviar el pedido', type: 'error' });
      return;
    }

    setNotification({ 
      message: `¡Pedido ${res.orderId} enviado a Cocina exitosamente!`, 
      type: 'success' 
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  Pedido Actual del Mesero
                </h2>
                <p className="text-xs text-stone-400">
                  {cartTotalCount} {cartTotalCount === 1 ? 'platillo' : 'platillos'} en la orden
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback banner */}
          {notification && (
            <div className={`p-3 text-xs font-semibold flex items-center justify-between ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-rose-500 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{notification.message}</span>
              </div>
              {notification.type === 'success' && (
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveRole('cocina');
                  }}
                  className="px-2 py-0.5 bg-stone-950 text-amber-400 text-[10px] font-bold rounded"
                >
                  Ver en Cocina →
                </button>
              )}
            </div>
          )}

          {/* Scrollable Order Form & Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {/* Table & Customer Details */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/90 space-y-3">
              
              {/* Table Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-600" />
                  Mesa / Ubicación
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {quickTables.map((tbl) => (
                    <button
                      key={tbl}
                      type="button"
                      onClick={() => setCurrentTable(tbl)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition min-h-[38px] active:scale-95 ${
                        currentTable.toString() === tbl
                          ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {tbl.startsWith('Barra') || tbl.startsWith('Para') ? tbl : `Mesa ${tbl}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Name Input (Required) */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Nombre del Cliente <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Don Carlos, Sra. Martha, Mesa Familiar..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-base sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[44px]"
                />
              </div>

              {/* General Order Notes */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Nota General de la Mesa (Opcional)
                </label>
                <input
                  type="text"
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Ej. Servir platos al mismo tiempo / Mesa exterior"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-base sm:text-xs focus:outline-none focus:border-amber-500 min-h-[40px]"
                />
              </div>

            </div>

            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Items en la Orden ({cartTotalCount})
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vaciar</span>
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-10 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                  <p className="text-sm font-semibold text-stone-600">Aún no hay platillos seleccionados</p>
                  <p className="text-xs text-stone-400">
                    Toca en cualquier platillo del menú para agregarlo a la mesa actual.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.dishId}
                      className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.dishName}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 leading-tight">
                              {item.dishName}
                            </h4>
                            <p className="text-xs text-stone-500">
                              Unitario: ${item.price.toFixed(2)} USD
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.dishId)}
                          className="text-stone-300 hover:text-rose-600 p-1"
                          title="Eliminar de la orden"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Controls & Line Estimate */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                          <button
                            onClick={() => updateCartQuantity(item.dishId, -1)}
                            className="w-8 h-8 bg-white hover:bg-stone-50 text-stone-700 rounded-lg flex items-center justify-center font-black shadow-2xs transition active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-black text-sm text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.dishId, 1)}
                            className="w-8 h-8 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg flex items-center justify-center font-black shadow-2xs transition active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Line Item Estimate */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block">Estimado:</span>
                          <span className="font-extrabold text-sm text-stone-900">
                            ${item.itemTotal.toFixed(2)} USD
                          </span>
                        </div>
                      </div>

                      {/* Specific Item Note */}
                      <div>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => updateCartItemNotes(item.dishId, e.target.value)}
                          placeholder="Nota (ej. sin cebolla, bien tostado, con hielo...)"
                          className="w-full text-base sm:text-xs px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 focus:outline-none focus:border-amber-500 min-h-[38px]"
                        />
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* Footer Receipt Summary & Send Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              
              {/* Receipt Summary Box */}
              <div className="space-y-1.5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200/80">
                <div className="flex justify-between">
                  <span>Items en total:</span>
                  <span className="font-bold text-stone-900">{cartTotalCount} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal platillos:</span>
                  <span className="font-semibold">${cartSubtotal.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA estimado (15%):</span>
                  <span className="font-semibold">${cartTax.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1.5 border-t border-stone-100">
                  <span>Total Recibo Estimado:</span>
                  <span className="text-amber-600">${cartTotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Submit to Kitchen */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!customerName.trim()}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] ${
                  customerName.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {customerName.trim() ? `Enviar Orden a Cocina (${cartTotalCount} items)` : 'Ingresa el nombre del cliente'}
                </span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
