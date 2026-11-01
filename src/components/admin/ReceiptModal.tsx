import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Printer, Receipt, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { 
    selectedReceiptOrder, 
    setSelectedReceiptOrder, 
    invoices, 
    setSelectedInvoiceOrder, 
    setSelectedViewInvoice 
  } = useRestaurant();

  if (!selectedReceiptOrder) return null;

  const order = selectedReceiptOrder;
  const existingInvoice = invoices.find((i) => i.orderId === order.id);
  const isPaid = order.status === 'cliente ya canceló el pedido' || !!existingInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-300 text-stone-900 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar */}
        <div className="p-3 bg-stone-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Recibo / Pre-Cuenta</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition min-h-[36px] active:scale-95"
              title="Imprimir ticket térmico"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Content Container */}
        <div className="p-5 sm:p-7 space-y-4 font-mono text-xs bg-stone-50 print:p-0 print:bg-white overflow-y-auto flex-1">
          
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-400">
            <h2 className="font-extrabold text-base tracking-tight text-stone-900 font-sans">
              EL RINCÓN DEL BOLÓN & MARISCOS
            </h2>
            <p className="text-[11px] text-stone-600">RUC: 0992384756001</p>
            <p className="text-[10px] text-stone-500">
              Av. Víctor Emilio Estrada & Las Monjas, Urdesa, Guayaquil - Ecuador
            </p>
            <p className="text-[10px] text-stone-500">Tel: (04) 288-4590 / 099-123-4567</p>
            <div className="pt-1">
              {existingInvoice ? (
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ FACTURA ELECTRÓNICA SRI: {existingInvoice.id.replace('FAC-', '')}
                </span>
              ) : (
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {isPaid ? '✓ CLIENTE YA CANCELÓ EL PEDIDO' : 'PRE-CUENTA / PENDIENTE DE PAGO'}
                </span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-[11px] text-stone-700 pb-2 border-b border-dashed border-stone-300">
            <div className="flex justify-between">
              <span className="font-bold">Comanda:</span>
              <span>#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Mesa:</span>
              <span className="font-extrabold">
                {typeof order.tableNumber === 'number' || !order.tableNumber.includes(' ')
                  ? `MESA ${order.tableNumber}`
                  : order.tableNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Cliente:</span>
              <span className="font-extrabold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Mesero:</span>
              <span>{order.waiterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Fecha / Hora:</span>
              <span>{order.createdAt}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between font-bold text-stone-900 border-b border-stone-300 pb-1 text-[11px]">
              <span className="w-8">Cant.</span>
              <span className="flex-1">Descripción</span>
              <span className="w-14 text-right">P. Unit</span>
              <span className="w-14 text-right">Total</span>
            </div>

            <div className="space-y-2 text-stone-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start text-[11px]">
                    <span className="w-8 font-bold">{item.quantity}</span>
                    <span className="flex-1 font-sans font-medium text-xs text-stone-900 pr-1">
                      {item.dishName}
                    </span>
                    <span className="w-14 text-right">${item.price.toFixed(2)}</span>
                    <span className="w-14 text-right font-bold">${item.itemTotal.toFixed(2)}</span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-stone-500 pl-8 italic">
                      Nota: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="pt-2 border-t-2 border-dashed border-stone-400 space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Total platillos/items:</span>
              <span className="font-bold">{order.totalItemsCount} unid.</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span>IVA Ecuador (15%):</span>
              <span>${order.tax.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>Propina sugerida (10%):</span>
              <span>${(order.subtotal * 0.10).toFixed(2)} USD</span>
            </div>
            
            {/* Grand Total */}
            <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-800">
              <span>TOTAL A PAGAR:</span>
              <span>${order.total.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-3 border-t border-dashed border-stone-300 text-[10px] text-stone-500 space-y-1">
            <p>¡Gracias por preferir la auténtica sazón ecuatoriana!</p>
            <p className="font-sans font-semibold">El Rincón del Bolón & Mariscos</p>
            <p className="text-[9px] text-stone-400">Documento sin validez tributaria para fines de demo</p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-2 no-print">
          <div>
            {existingInvoice ? (
              <button
                onClick={() => {
                  setSelectedReceiptOrder(null);
                  setSelectedViewInvoice(existingInvoice);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ver RIDE Oficial SRI</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedReceiptOrder(null);
                  setSelectedInvoiceOrder(order);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Facturar con SRI (Electrónica)</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setSelectedReceiptOrder(null)}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs transition"
          >
            Cerrar Recibo
          </button>
        </div>

      </div>
    </div>
  );
};
