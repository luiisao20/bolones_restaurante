import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LoginModal } from './components/common/LoginModal';
import { ReceiptModal } from './components/admin/ReceiptModal';
import { ElectronicInvoiceModal } from './components/billing/ElectronicInvoiceModal';
import { RideModal } from './components/billing/RideModal';
import { XmlViewerModal } from './components/billing/XmlViewerModal';
import { WaiterView } from './components/waiter/WaiterView';
import { KitchenView } from './components/kitchen/KitchenView';
import { AdminView } from './components/admin/AdminView';

const MainContent: React.FC = () => {
  const { activeRole } = useRestaurant();

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 pb-20 md:pb-0">
      {/* Top Navigation & Role Bar */}
      <Header />

      {/* Main Dynamic View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
        {activeRole === 'mesero' && <WaiterView />}
        {activeRole === 'cocina' && <KitchenView />}
        {activeRole === 'admin' && <AdminView />}
      </main>

      {/* Mobile Bottom Navigation (Phones & Small Tablets) */}
      <BottomNav />

      {/* Global Modals */}
      <ReceiptModal />
      <ElectronicInvoiceModal />
      <RideModal />
      <XmlViewerModal />
      <LoginModal />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs border-t border-stone-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-400 font-black">🇪🇨 El Rincón del Bolón & Mariscos</span>
            <span>•</span>
            <span>Sistema Demo de Punto de Venta & Cocina</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Bolones • Patacones • Encebollado • Ceviches • Jugos Naturales • Colas • Cervezas Ecuatorianas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainContent />
    </RestaurantProvider>
  );
}
