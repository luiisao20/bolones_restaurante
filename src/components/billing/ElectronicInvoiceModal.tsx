import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { IdentificationType, PaymentMethodCode, SriCustomer } from '../../types';
import { 
  SRI_CONFIG, 
  PAYMENT_METHODS, 
  DEMO_CUSTOMERS, 
  formatSequentialNumber,
  querySriIdentification,
  type SriLookupResult
} from '../../utils/sriUtils';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Mail, 
  Copy, 
  Check, 
  Loader2, 
  Lock, 
  Sparkles, 
  Printer, 
  Code2, 
  Building2,
  DollarSign,
  Search,
  AlertCircle
} from 'lucide-react';

type SimulationStep = 'idle' | 'xml' | 'signing' | 'sri_reception' | 'sri_auth' | 'done';

export const ElectronicInvoiceModal: React.FC = () => {
  const { 
    selectedInvoiceOrder, 
    setSelectedInvoiceOrder, 
    issueSriInvoice, 
    nextSequential,
    setSelectedViewInvoice,
    setSelectedViewXml
  } = useRestaurant();

  const [identificationType, setIdentificationType] = useState<IdentificationType>('05');
  const [identification, setIdentification] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Guayaquil');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode>('01');
  const [includeTip, setIncludeTip] = useState(false);

  // SRI Lookup state
  const [isSearchingSri, setIsSearchingSri] = useState(false);
  const [sriLookupStatus, setSriLookupStatus] = useState<SriLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Simulation state
  const [step, setStep] = useState<SimulationStep>('idle');
  const [issuedInvoice, setIssuedInvoice] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (selectedInvoiceOrder) {
      setStep('idle');
      setIssuedInvoice(null);
      setIncludeTip(false);
      setSriLookupStatus(null);
      setLookupError(null);

      // Try smart pre-fill based on order's customer name
      const matchingDemo = DEMO_CUSTOMERS.find(d => 
        d.customer.name.toLowerCase().includes(selectedInvoiceOrder.customerName.toLowerCase()) ||
        selectedInvoiceOrder.customerName.toLowerCase().includes(d.customer.name.toLowerCase())
      );

      if (matchingDemo) {
        fillCustomer(matchingDemo.customer);
      } else {
        setIdentificationType('05');
        setIdentification('');
        setCustomerName(selectedInvoiceOrder.customerName);
        setEmail('');
        setPhone('0991234567');
        setAddress('Guayaquil, Ecuador');
        setPaymentMethod('01');
      }
    }
  }, [selectedInvoiceOrder]);

  if (!selectedInvoiceOrder) return null;

  const order = selectedInvoiceOrder;
  const subtotal = order.subtotal;
  const tax15 = order.tax;
  const tipAmount = includeTip ? Number((subtotal * 0.10).toFixed(2)) : 0;
  const totalToInvoice = Number((subtotal + tax15 + tipAmount).toFixed(2));

  const fillCustomer = (c: SriCustomer) => {
    setIdentificationType(c.identificationType);
    setIdentification(c.identification);
    setCustomerName(c.name);
    setEmail(c.email);
    setPhone(c.phone || '');
    setAddress(c.address || 'Guayaquil');
    setSriLookupStatus(null);
    setLookupError(null);
  };

  const handleSelectConsumidorFinal = () => {
    fillCustomer(DEMO_CUSTOMERS[0].customer);
  };

  const handleLookupSri = async () => {
    if (identificationType === '07') return;
    const clean = identification.trim().replace(/\D/g, '');
    if (!clean) {
      setLookupError('Por favor ingrese un número de cédula (10 dígitos) o RUC (13 dígitos).');
      return;
    }

    setIsSearchingSri(true);
    setLookupError(null);
    setSriLookupStatus(null);

    try {
      const result = await querySriIdentification(clean);
      setCustomerName(result.name);
      if (result.address && (!address || address === 'Guayaquil')) {
        setAddress(result.address);
      }
      if (result.email && !email) {
        setEmail(result.email);
      }
      setSriLookupStatus(result);
    } catch (err: any) {
      setLookupError(err.message || 'Error al consultar datos en el SRI.');
    } finally {
      setIsSearchingSri(false);
    }
  };

  const handleIssueInvoice = async () => {
    // Validation
    if (!customerName.trim()) {
      alert('Por favor ingrese el nombre o razón social del cliente.');
      return;
    }

    if (identificationType !== '07' && !identification.trim()) {
      alert('Por favor ingrese el número de cédula o RUC.');
      return;
    }

    // Step-by-step realistic SRI simulation
    setStep('xml');
    await new Promise((r) => setTimeout(r, 650));

    setStep('signing');
    await new Promise((r) => setTimeout(r, 800));

    setStep('sri_reception');
    await new Promise((r) => setTimeout(r, 850));

    setStep('sri_auth');
    await new Promise((r) => setTimeout(r, 700));

    const invoice = await issueSriInvoice({
      order,
      customer: {
        identificationType,
        identification: identificationType === '07' ? '9999999999999' : identification.trim(),
        name: customerName.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim() || 'Guayaquil'
      },
      paymentMethod,
      tip: tipAmount
    });

    setIssuedInvoice(invoice);
    setStep('done');
  };

  const handleCopyAccessKey = () => {
    if (issuedInvoice?.accessKey) {
      navigator.clipboard.writeText(issuedInvoice.accessKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-300 text-stone-900 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header with SRI Badge */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-tight text-white">
                  Emisión de Factura Electrónica SRI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SRI Producción
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Conexión directa SOAP con cel.sri.gob.ec • Firma XAdES-BES
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedInvoiceOrder(null)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">

          {/* Quick Info Ribbon */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-stone-500 block">Comanda / Pedido:</span>
              <span className="font-mono font-bold text-stone-900 text-xs">
                #{order.id} • {typeof order.tableNumber === 'number' || !order.tableNumber.includes(' ') ? `Mesa ${order.tableNumber}` : order.tableNumber}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">Establecimiento y Punto:</span>
              <span className="font-mono font-semibold text-stone-800 text-xs">
                {SRI_CONFIG.establecimiento}-{SRI_CONFIG.puntoEmision}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">Siguiente Secuencial:</span>
              <span className="font-mono font-bold text-amber-600 text-xs">
                {formatSequentialNumber(nextSequential)}
              </span>
            </div>
          </div>

          {step === 'idle' ? (
            <>
              {/* Demo Pre-fill shortcuts */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Relleno rápido para presentación demo:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={handleSelectConsumidorFinal}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold border border-stone-300 transition"
                  >
                    ⚡ Consumidor Final (9999999999999)
                  </button>
                  {DEMO_CUSTOMERS.slice(1).map((dc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => fillCustomer(dc.customer)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-300 transition"
                    >
                      👤 {dc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Form Grid */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3.5">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  1. Datos del Comprador (Requisitos SRI)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Tipo de Identificación *
                    </label>
                    <select
                      value={identificationType}
                      onChange={(e) => {
                        const val = e.target.value as IdentificationType;
                        setIdentificationType(val);
                        if (val === '07') {
                          setIdentification('9999999999999');
                          setCustomerName('CONSUMIDOR FINAL');
                        }
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="05">05 - Cédula de Identidad</option>
                      <option value="04">04 - R.U.C. (Empresas / Personas Naturales)</option>
                      <option value="06">06 - Pasaporte</option>
                      <option value="07">07 - Consumidor Final</option>
                      <option value="08">08 - Identificación del Exterior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>Número de Identificación *</span>
                      {sriLookupStatus && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          SRI Verificado
                        </span>
                      )}
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        disabled={identificationType === '07'}
                        value={identification}
                        onChange={(e) => {
                          setIdentification(e.target.value);
                          setSriLookupStatus(null);
                          setLookupError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLookupSri();
                          }
                        }}
                        placeholder={identificationType === '04' ? 'Ej. 0992384756001' : 'Ej. 0923847561'}
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 disabled:opacity-60 focus:outline-none focus:border-amber-500"
                      />
                      {identificationType !== '07' && (
                        <button
                          type="button"
                          onClick={handleLookupSri}
                          disabled={isSearchingSri || !identification.trim()}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold rounded-lg text-xs transition flex items-center gap-1.5 shrink-0 shadow-2xs"
                          title="Consultar nombre legal en los servicios del SRI Ecuador"
                        >
                          {isSearchingSri ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Search className="w-3.5 h-3.5" />
                          )}
                          <span>{isSearchingSri ? 'Buscando...' : 'Buscar SRI'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SRI Lookup Error Alert */}
                  {lookupError && (
                    <div className="sm:col-span-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 flex items-center gap-2 animate-in fade-in duration-150">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{lookupError}</span>
                    </div>
                  )}

                  {/* SRI Verification Status Badge */}
                  {sriLookupStatus && (
                    <div className="sm:col-span-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] text-emerald-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold">Contribuyente en SRI en Línea: </span>
                          <span className="text-emerald-800">{sriLookupStatus.regimen}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold uppercase">
                        {sriLookupStatus.source === 'SRI_ONLINE' ? 'SRI Producción' : 'Catastro SRI'}
                      </span>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Razón Social / Nombres y Apellidos Completos *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. MARÍA ELENA DELGADO MENDOZA"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>Correo Electrónico (Para envío de RIDE y XML)</span>
                      {identificationType !== '07' && (
                        <span className="text-[10px] text-amber-600 font-semibold">Legal</span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cliente@ejemplo.com"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Teléfono Móvil
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0991234567"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Dirección del Comprador
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Av. Víctor Emilio Estrada, Guayaquil"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection (SRI Codes) */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  2. Forma de Pago (Tabla Oficial SRI)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.code}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        paymentMethod === pm.code
                          ? 'bg-amber-50 border-amber-400 text-stone-950 font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.code}
                        checked={paymentMethod === pm.code}
                        onChange={() => setPaymentMethod(pm.code)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm">{pm.icon}</span>
                      <div className="flex-1 text-[11px]">
                        <span className="block font-bold">{pm.label}</span>
                        <span className="text-[10px] text-stone-400 font-mono">Código SRI: {pm.code}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Items Preview and Tax Breakdown */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider border-b border-stone-200 pb-2">
                  3. Desglose de Impuestos (Ecuador IVA 15%)
                </h3>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] text-stone-700 py-0.5 border-b border-stone-100">
                      <span className="truncate flex-1">
                        <span className="font-bold text-stone-900">{item.quantity}x</span> {item.dishName}
                      </span>
                      <span className="font-mono text-stone-900 font-semibold ml-2">
                        ${item.itemTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal Tarifa 15%:</span>
                    <span className="font-mono font-medium">${subtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal Tarifa 0%:</span>
                    <span className="font-mono font-medium">$0.00 USD</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>IVA Ecuador (15%):</span>
                    <span className="font-mono font-bold text-stone-900">${tax15.toFixed(2)} USD</span>
                  </div>
                  
                  {/* Tip toggle */}
                  <div className="flex items-center justify-between text-stone-600 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTip}
                        onChange={(e) => setIncludeTip(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Propina sugerida de servicio (10%):</span>
                    </label>
                    <span className="font-mono font-medium">
                      {includeTip ? `$${(subtotal * 0.10).toFixed(2)}` : '$0.00'} USD
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-800">
                    <span>TOTAL A FACTURAR:</span>
                    <span className="font-mono text-amber-600">${totalToInvoice.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </>
          ) : step === 'done' ? (
            /* Success Authorized Screen */
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-300 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 bg-emerald-200/80 text-emerald-900 font-black text-xs rounded-full uppercase tracking-wider">
                  ✓ AUTORIZADO POR EL SRI
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  Factura {issuedInvoice?.id} Emitida con Éxito
                </h3>
                <p className="text-xs text-stone-600">
                  Documento tributario con plena validez legal ante el Servicio de Rentas Internas del Ecuador.
                </p>
              </div>

              {/* Access Key and Auth Details Box */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200 text-left space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[11px] text-stone-500 font-sans">Número de Autorización:</span>
                  <span className="font-bold text-stone-900 text-[11px]">
                    {issuedInvoice?.authorizationNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[11px] text-stone-500 font-sans">Fecha y Hora Autorización:</span>
                  <span className="font-bold text-stone-900 text-[11px]">
                    {issuedInvoice?.authorizationDate}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans mb-1">
                    <span>Clave de Acceso (49 dígitos oficiales):</span>
                    <button
                      onClick={handleCopyAccessKey}
                      className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copiada' : 'Copiar clave'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 break-all text-[11px] font-bold text-stone-800">
                    {issuedInvoice?.accessKey}
                  </div>
                </div>
              </div>

              {/* Delivery notification */}
              {issuedInvoice?.emailSent ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>
                    Comprobantes enviados automáticamente a <b>{issuedInvoice.customer.email}</b> (XML + RIDE PDF).
                  </span>
                </div>
              ) : (
                <div className="p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-[11px] text-stone-600">
                  Emitida a Consumidor Final. Disponible para impresión de ticket o RIDE en caja.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setSelectedInvoiceOrder(null);
                    setSelectedViewInvoice(issuedInvoice);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Ver / Imprimir RIDE Oficial (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedViewXml(issuedInvoice);
                  }}
                  className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Inspeccionar XML Firmado</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Step-by-Step Simulation View */
            <div className="py-8 px-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-base font-black text-white">
                  Procesando Factura Electrónica con el SRI
                </h3>
                <p className="text-xs text-stone-400">
                  Ejecución directa en servidores de producción del SRI Ecuador
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-3 font-mono text-xs">
                
                {/* Step 1 */}
                <div className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  step === 'xml'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300'
                }`}>
                  {step === 'xml' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="flex-1">1. Generando XML y Clave de Acceso (49 dígitos Módulo 11)</span>
                </div>

                {/* Step 2 */}
                <div className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  step === 'signing'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : step === 'xml'
                    ? 'bg-stone-800/40 border-stone-800 text-stone-500'
                    : 'bg-stone-800/80 border-stone-700 text-stone-300'
                }`}>
                  {step === 'signing' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : step === 'xml' ? (
                    <Lock className="w-4 h-4 text-stone-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="flex-1">2. Firmando con Certificado .p12 (Estándar XAdES-BES)</span>
                </div>

                {/* Step 3 */}
                <div className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  step === 'sri_reception'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : step === 'sri_auth'
                    ? 'bg-stone-800/80 border-stone-700 text-stone-300'
                    : 'bg-stone-800/40 border-stone-800 text-stone-500'
                }`}>
                  {step === 'sri_reception' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : step === 'sri_auth' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Send className="w-4 h-4 text-stone-600" />
                  )}
                  <span className="flex-1">3. Conectando con SRI Recepción (validarComprobante SOAP)</span>
                </div>

                {/* Step 4 */}
                <div className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  step === 'sri_auth'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-stone-800/40 border-stone-800 text-stone-500'
                }`}>
                  {step === 'sri_auth' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-stone-600" />
                  )}
                  <span className="flex-1">4. Verificando Autorización Oficial del SRI...</span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500 font-mono">
            {step === 'idle' && (
              <span>Total a emitir: <b className="text-stone-900">${totalToInvoice.toFixed(2)} USD</b></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedInvoiceOrder(null)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs transition"
            >
              {step === 'done' ? 'Cerrar' : 'Cancelar'}
            </button>

            {step === 'idle' && (
              <button
                type="button"
                onClick={handleIssueInvoice}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Firmar & Emitir al SRI</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
