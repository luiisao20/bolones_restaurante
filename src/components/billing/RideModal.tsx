import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { SRI_CONFIG } from '../../utils/sriUtils';
import { 
  X, 
  Printer, 
  Check, 
  ShieldCheck, 
  Mail, 
  ExternalLink
} from 'lucide-react';

export const RideModal: React.FC = () => {
  const { selectedViewInvoice, setSelectedViewInvoice, setSelectedViewXml, resendInvoiceEmail } = useRestaurant();
  const [viewMode, setViewMode] = useState<'ride-a4' | 'ticket-pos'>('ride-a4');
  const [copiedKey, setCopiedKey] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  if (!selectedViewInvoice) return null;

  const invoice = selectedViewInvoice;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(invoice.accessKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleResendEmail = () => {
    if (!invoice.customer.email) {
      alert('Esta factura no tiene un correo registrado (Consumidor Final).');
      return;
    }
    resendInvoiceEmail(invoice.id);
    setEmailSentAlert(true);
    setTimeout(() => setEmailSentAlert(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-300 text-stone-900 my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                RIDE SRI - {invoice.id}
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✓ AUTORIZADO POR EL SRI
              </span>
            </div>
          </div>

          {/* View Mode Toggle & Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex bg-stone-800 p-0.5 rounded-lg border border-stone-700 text-xs">
              <button
                onClick={() => setViewMode('ride-a4')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  viewMode === 'ride-a4' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:text-white'
                }`}
              >
                Formato RIDE Oficial
              </button>
              <button
                onClick={() => setViewMode('ticket-pos')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  viewMode === 'ticket-pos' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:text-white'
                }`}
              >
                Ticket Térmico (80mm)
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              title="Imprimir documento oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            {invoice.customer.email && (
              <button
                onClick={handleResendEmail}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition"
                title="Reenviar comprobante por correo"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Reenviar Correo</span>
              </button>
            )}

            <button
              onClick={() => setSelectedViewXml(invoice)}
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition"
              title="Ver XML firmado de la factura"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ver XML</span>
            </button>

            <button
              onClick={() => setSelectedViewInvoice(null)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resend email feedback alert */}
        {emailSentAlert && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-bold flex items-center justify-center gap-2 no-print">
            <Check className="w-4 h-4" />
            <span>Factura y RIDE enviados exitosamente a {invoice.customer.email}</span>
          </div>
        )}

        {/* Scrollable Document Container */}
        <div className="p-4 sm:p-8 max-h-[82vh] overflow-y-auto bg-stone-100 print:bg-white print:p-0 print:overflow-visible">
          
          {viewMode === 'ride-a4' ? (
            /* OFFICIAL SRI RIDE A4 FORMAT */
            <div className="max-w-[780px] mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-stone-300 text-[11px] text-stone-900 font-sans space-y-4 print:shadow-none print:border-none print:p-0">
              
              {/* Header: Two Columns (Left: Emisor, Right: SRI Info & Barcode) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left Column: Issuer Information */}
                <div className="border border-stone-400 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <span className="text-2xl">🍤</span>
                    <div>
                      <h1 className="font-extrabold text-sm leading-tight text-stone-900">
                        {SRI_CONFIG.razonSocial}
                      </h1>
                      <p className="text-[10px] text-stone-600 font-bold">
                        {SRI_CONFIG.nombreComercial}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] text-stone-700 leading-snug">
                    <p><b>Dirección Matriz:</b> {SRI_CONFIG.dirMatriz}</p>
                    <p><b>Dirección Sucursal:</b> {SRI_CONFIG.dirEstablecimiento}</p>
                    <p><b>Contribuyente Especial Nro:</b> {SRI_CONFIG.contribuyenteEspecial}</p>
                    <p><b>OBLIGADO A LLEVAR CONTABILIDAD:</b> {SRI_CONFIG.obligadoContabilidad}</p>
                    <p><b>Régimen:</b> {SRI_CONFIG.regimen}</p>
                  </div>
                </div>

                {/* Right Column: Tax Identification & Access Key Barcode */}
                <div className="border border-stone-400 rounded-lg p-3 space-y-1.5 text-[10px]">
                  <p className="font-bold text-xs text-stone-900">
                    R.U.C.: <span className="font-mono text-sm">{SRI_CONFIG.ruc}</span>
                  </p>
                  <p className="font-black text-sm tracking-widest text-stone-900">
                    FACTURA
                  </p>
                  <p className="font-mono font-bold text-xs">
                    No. {invoice.id.replace('FAC-', '')}
                  </p>
                  
                  <div className="pt-1 space-y-0.5">
                    <p className="font-bold text-stone-800">NÚMERO DE AUTORIZACIÓN:</p>
                    <p className="font-mono text-[9px] break-all text-stone-700">{invoice.authorizationNumber}</p>
                  </div>

                  <div className="flex justify-between pt-0.5">
                    <p><b>FECHA Y HORA:</b> {invoice.authorizationDate}</p>
                    <p><b>AMBIENTE:</b> {invoice.environment}</p>
                  </div>
                  <p><b>EMISIÓN:</b> NORMAL</p>

                  {/* Simulated Code 128 Barcode for SRI */}
                  <div className="pt-2 text-center space-y-1">
                    <p className="font-bold text-[9px] text-left uppercase text-stone-800">CLAVE DE ACCESO:</p>
                    <div className="bg-white p-2 border border-stone-300 rounded flex flex-col items-center justify-center">
                      {/* Barcode visual representation */}
                      <div className="h-9 w-full flex items-center justify-center gap-[1.5px] px-2 py-0.5 bg-stone-950">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-full bg-white"
                            style={{
                              width: (i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '2px'),
                              opacity: (i % 5 === 0 ? 0.2 : 1)
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] font-bold text-stone-900 tracking-wider mt-1 break-all">
                        {invoice.accessKey}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Customer Box */}
              <div className="border border-stone-400 rounded-lg p-3 text-[10px] space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold">Razón Social / Nombres y Apellidos: </span>
                    <span className="font-bold text-stone-900 uppercase">{invoice.customer.name}</span>
                  </div>
                  <div>
                    <span className="font-bold">Identificación: </span>
                    <span className="font-mono font-bold text-stone-900">{invoice.customer.identification}</span>
                  </div>
                  <div>
                    <span className="font-bold">Fecha de Emisión: </span>
                    <span>{invoice.createdAt}</span>
                  </div>
                  <div>
                    <span className="font-bold">Guía de Remisión: </span>
                    <span>N/A</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-bold">Dirección: </span>
                    <span>{invoice.customer.address || 'Guayaquil'}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-400 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-stone-200 text-stone-800 font-bold uppercase border-b border-stone-400">
                    <tr>
                      <th className="py-2 px-2.5">Cod. Principal</th>
                      <th className="py-2 px-2 text-center">Cant</th>
                      <th className="py-2 px-3">Descripción</th>
                      <th className="py-2 px-2.5 text-right">Precio Unitario</th>
                      <th className="py-2 px-2 text-right">Descuento</th>
                      <th className="py-2 px-2.5 text-right">Precio Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-1.5 px-2.5 font-mono text-[9px] uppercase">{item.dishId}</td>
                        <td className="py-1.5 px-2 text-center font-bold">{item.quantity}.00</td>
                        <td className="py-1.5 px-3 font-medium">
                          {item.dishName}
                          {item.notes && <span className="block text-[9px] text-stone-500 italic">Obs: {item.notes}</span>}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono">${item.price.toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right font-mono">$0.00</td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold">${item.itemTotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom: Left Info Adicional & Pagos, Right Resumen de Impuestos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                
                {/* Left Info Box */}
                <div className="space-y-3">
                  
                  {/* Info Adicional */}
                  <div className="border border-stone-400 rounded-lg p-2.5 text-[10px] space-y-1">
                    <p className="font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                      Información Adicional
                    </p>
                    <p><b>Email:</b> {invoice.customer.email || 'N/A'}</p>
                    <p><b>Teléfono:</b> {invoice.customer.phone || 'N/A'}</p>
                    <p><b>Comanda / Mesa:</b> #{invoice.orderId} • Mesa {invoice.tableNumber}</p>
                    <p><b>Observación:</b> Comprobante generado y autorizado electrónicamente vía SRI.</p>
                  </div>

                  {/* Formas de Pago */}
                  <div className="border border-stone-400 rounded-lg overflow-hidden text-[10px]">
                    <div className="bg-stone-200 px-2.5 py-1 font-bold uppercase text-stone-800">
                      Formas de Pago
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-stone-100 text-stone-600 border-b border-stone-300 text-[9px]">
                        <tr>
                          <th className="py-1 px-2">Forma de Pago</th>
                          <th className="py-1 px-2 text-right">Total</th>
                          <th className="py-1 px-2 text-center">Plazo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1.5 px-2 font-medium">{invoice.paymentMethodLabel}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-bold">${invoice.total.toFixed(2)}</td>
                          <td className="py-1.5 px-2 text-center">0 días</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Right Tax Summary Box */}
                <div className="border border-stone-400 rounded-lg overflow-hidden">
                  <table className="w-full text-[10px]">
                    <tbody className="divide-y divide-stone-200 text-stone-700">
                      <tr>
                        <td className="py-1 px-3 font-bold">SUBTOTAL 15%:</td>
                        <td className="py-1 px-3 text-right font-mono">${invoice.subtotal15.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">SUBTOTAL 0%:</td>
                        <td className="py-1 px-3 text-right font-mono">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">SUBTOTAL NO OBJETO DE IVA:</td>
                        <td className="py-1 px-3 text-right font-mono">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">SUBTOTAL EXENTO DE IVA:</td>
                        <td className="py-1 px-3 text-right font-mono">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3 font-bold">SUBTOTAL SIN IMPUESTOS:</td>
                        <td className="py-1 px-3 text-right font-mono font-bold">${invoice.subtotal15.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">TOTAL DESCUENTO:</td>
                        <td className="py-1 px-3 text-right font-mono">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">ICE:</td>
                        <td className="py-1 px-3 text-right font-mono">$0.00</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3 font-bold">IVA 15%:</td>
                        <td className="py-1 px-3 text-right font-mono font-bold">${invoice.tax15.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-3">PROPINA (10%):</td>
                        <td className="py-1 px-3 text-right font-mono">${invoice.tip.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-stone-900 text-white font-black text-xs">
                        <td className="py-2 px-3">VALOR TOTAL:</td>
                        <td className="py-2 px-3 text-right font-mono">${invoice.total.toFixed(2)} USD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          ) : (
            /* POS THERMAL 80MM TICKET FORMAT */
            <div className="max-w-sm mx-auto bg-white p-5 rounded-xl shadow-md border border-stone-300 font-mono text-xs text-stone-900 space-y-3 print:shadow-none print:border-none print:p-0">
              
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-400">
                <h2 className="font-extrabold text-sm font-sans">{SRI_CONFIG.nombreComercial}</h2>
                <p className="text-[11px] font-bold text-stone-700">{SRI_CONFIG.razonSocial}</p>
                <p className="text-[11px]">RUC: {SRI_CONFIG.ruc}</p>
                <p className="text-[10px] text-stone-500">{SRI_CONFIG.dirMatriz}</p>
                <p className="text-[10px] text-stone-500">Obligado a llevar contabilidad: SI</p>
                <div className="pt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    FACTURA ELECTRÓNICA SRI
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-stone-300">
                <div className="flex justify-between">
                  <span className="font-bold">Factura:</span>
                  <span className="font-bold">{invoice.id.replace('FAC-', '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Fecha / Hora:</span>
                  <span>{invoice.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Cliente:</span>
                  <span className="font-bold uppercase">{invoice.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">RUC/Cédula:</span>
                  <span>{invoice.customer.identification}</span>
                </div>
                {invoice.customer.email && (
                  <div className="flex justify-between">
                    <span className="font-bold">Email:</span>
                    <span className="text-[10px] truncate max-w-[180px]">{invoice.customer.email}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-1.5 py-1">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[11px]">
                    <span className="w-6 font-bold">{item.quantity}x</span>
                    <span className="flex-1 font-sans">{item.dishName}</span>
                    <span className="w-14 text-right font-bold">${item.itemTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t-2 border-dashed border-stone-400 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal 15%:</span>
                  <span>${invoice.subtotal15.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA 15%:</span>
                  <span>${invoice.tax15.toFixed(2)}</span>
                </div>
                {invoice.tip > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Propina (10%):</span>
                    <span>${invoice.tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-stone-800">
                  <span>TOTAL USD:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-600 pt-1">
                  <span>Forma de Pago:</span>
                  <span>{invoice.paymentMethodLabel}</span>
                </div>
              </div>

              {/* Clave de Acceso Footer */}
              <div className="pt-2 border-t border-dashed border-stone-400 space-y-1.5 text-[9px]">
                <p className="font-bold text-center">AUTORIZACIÓN SRI & CLAVE DE ACCESO:</p>
                <p className="break-all font-mono text-[9px] bg-stone-100 p-1.5 rounded text-center font-bold">
                  {invoice.accessKey}
                </p>
                <p className="text-center text-[10px] text-stone-500">
                  Consulte su comprobante en: https://srienlinea.sri.gob.ec
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center gap-2 no-print">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="font-mono text-[11px]">Clave: {invoice.accessKey.slice(0, 15)}...</span>
            <button
              onClick={handleCopyKey}
              className="text-stone-700 hover:text-stone-900 font-bold ml-1"
            >
              {copiedKey ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>

          <button
            onClick={() => setSelectedViewInvoice(null)}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs transition"
          >
            Cerrar RIDE
          </button>
        </div>

      </div>
    </div>
  );
};
