import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { SRI_CONFIG } from '../../utils/sriUtils';
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  Code2, 
  Mail, 
  DollarSign, 
  FileCheck, 
  Hash, 
  CheckCircle2
} from 'lucide-react';

export const InvoicesListTab: React.FC = () => {
  const { 
    invoices, 
    setSelectedViewInvoice, 
    setSelectedViewXml, 
    resendInvoiceEmail,
    nextSequential 
  } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalTaxCollected = invoices.reduce((sum, inv) => sum + inv.tax15, 0);
  const authorizedCount = invoices.filter((inv) => inv.status === 'AUTORIZADO').length;

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      inv.id.toLowerCase().includes(q) ||
      inv.customer.name.toLowerCase().includes(q) ||
      inv.customer.identification.toLowerCase().includes(q) ||
      inv.accessKey.toLowerCase().includes(q) ||
      inv.orderId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* SRI Server Live Status Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-4 sm:p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">
                Servicio de Rentas Internas (SRI) del Ecuador
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Web Services Conectados
              </span>
            </div>
            <p className="text-xs text-stone-400">
              RUC: {SRI_CONFIG.ruc} • {SRI_CONFIG.razonSocial} • IVA Vigente: 15%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-stone-800/80 border border-stone-700 rounded-xl text-stone-300">
            <span className="text-[10px] text-stone-500 block">Establecimiento:</span>
            <span className="font-mono font-bold text-amber-400">{SRI_CONFIG.establecimiento}-{SRI_CONFIG.puntoEmision}</span>
          </div>
          <div className="px-3 py-1.5 bg-stone-800/80 border border-stone-700 rounded-xl text-stone-300">
            <span className="text-[10px] text-stone-500 block">Próximo Secuencial:</span>
            <span className="font-mono font-bold text-white">{String(nextSequential).padStart(9, '0')}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Facturado SRI</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">${totalInvoiced.toFixed(2)}</p>
            <p className="text-[11px] text-stone-500">Comprobantes con validez tributaria</p>
          </div>
        </div>

        {/* IVA 15% Collected */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">IVA 15% Recaudado</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">${totalTaxCollected.toFixed(2)}</p>
            <p className="text-[11px] text-stone-500">Crédito / débito fiscal SRI</p>
          </div>
        </div>

        {/* Authorized Count */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Comprobantes Autorizados</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-black text-stone-900">{authorizedCount} facturas</p>
            <p className="text-[11px] text-stone-500">100% autorizadas por el SRI</p>
          </div>
        </div>

        {/* Next Sequential */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Secuencial Actual</span>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Hash className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl font-black text-stone-900 font-mono">
              001-001-{String(nextSequential - 1).padStart(9, '0')}
            </p>
            <p className="text-[11px] text-stone-500">Emisión sin saltos ni duplicados</p>
          </div>
        </div>

      </div>

      {/* Invoices Table & Search */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4">
        
        {/* Search header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por factura, cliente, cédula/RUC o clave..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs text-stone-500">
            Mostrando <b>{filteredInvoices.length}</b> de {invoices.length} facturas emitidas
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/80 text-stone-600 font-bold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Factura</th>
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Cliente / Razón Social</th>
                <th className="py-3 px-4">Identificación</th>
                <th className="py-3 px-4">Forma de Pago</th>
                <th className="py-3 px-4 text-center">Estado SRI</th>
                <th className="py-3 px-4 text-right">IVA 15%</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 text-stone-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-amber-50/40 transition">
                  
                  {/* Invoice ID */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    <span className="text-amber-700">{inv.id.replace('FAC-', '')}</span>
                    <span className="block text-[10px] text-stone-400 font-normal">
                      Pedido #{inv.orderId}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-[11px] text-stone-600">
                    {inv.createdAt}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 font-bold text-stone-900 max-w-[200px]">
                    <div className="truncate uppercase">{inv.customer.name}</div>
                    {inv.customer.email ? (
                      <span className="text-[10px] text-blue-600 font-normal truncate block">
                        📧 {inv.customer.email}
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-normal block">
                        Sin correo (Ticket físico)
                      </span>
                    )}
                  </td>

                  {/* ID */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-800 font-bold">
                      {inv.customer.identification}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-4 text-[11px] text-stone-700">
                    {inv.paymentMethodLabel}
                  </td>

                  {/* SRI Status */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      AUTORIZADO
                    </span>
                  </td>

                  {/* Tax */}
                  <td className="py-3 px-4 text-right font-mono text-stone-600">
                    ${inv.tax15.toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 text-right font-mono font-black text-stone-900">
                    ${inv.total.toFixed(2)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedViewInvoice(inv)}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] transition shadow-2xs flex items-center gap-1"
                        title="Ver e imprimir RIDE oficial"
                      >
                        <Printer className="w-3 h-3" />
                        <span>RIDE</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedViewXml(inv)}
                        className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition"
                        title="Ver XML firmado"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                      </button>

                      {inv.customer.email && (
                        <button
                          onClick={() => {
                            resendInvoiceEmail(inv.id);
                            alert(`Factura reenviada a ${inv.customer.email}`);
                          }}
                          className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                          title="Reenviar a correo del cliente"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-stone-500 text-xs">
            No se encontraron facturas con el término ingresado.
          </div>
        )}

      </div>

    </div>
  );
};
