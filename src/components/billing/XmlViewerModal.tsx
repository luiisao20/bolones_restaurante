import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Copy, Check, Download, Code2, ShieldCheck } from 'lucide-react';

export const XmlViewerModal: React.FC = () => {
  const { selectedViewXml, setSelectedViewXml } = useRestaurant();
  const [copied, setCopied] = useState(false);

  if (!selectedViewXml) return null;

  const invoice = selectedViewXml;
  const xml = invoice.xmlContent || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id.replace('FAC-', 'FACTURA_')}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 text-stone-100 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-3.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                XML Factura Electrónica (Esquema SRI v1.1.0)
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                {invoice.id} • Clave: {invoice.accessKey.slice(0, 20)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .xml</span>
            </button>
            <button
              onClick={() => setSelectedViewXml(null)}
              className="p-1 text-stone-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-auto bg-stone-950 text-emerald-400 font-mono text-[11px] leading-relaxed select-all">
          <pre>{xml}</pre>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-stone-900 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Estructura XML validada conforme a la ficha técnica del SRI Ecuador.
          </span>
          <button
            onClick={() => setSelectedViewXml(null)}
            className="text-stone-300 hover:text-white underline"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
