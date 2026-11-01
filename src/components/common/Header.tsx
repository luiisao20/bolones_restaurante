import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { Role } from '../../types';
import { 
  UtensilsCrossed, 
  ChefHat, 
  BarChart3, 
  RotateCcw, 
  LogIn, 
  ShoppingBag
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeRole, 
    setActiveRole, 
    setIsLoginModalOpen, 
    orders, 
    cartTotalCount, 
    setIsCartOpen,
    resetDemoData 
  } = useRestaurant();

  // Active kitchen orders count (recien ordenado + preparando)
  const kitchenPendingCount = orders.filter(
    (o) => o.status === 'recien ordenado' || o.status === 'preparando'
  ).length;

  const roleConfigs: { role: Role; label: string; icon: React.ReactNode; badge?: number }[] = [
    { 
      role: 'mesero', 
      label: 'Vista Mesero', 
      icon: <UtensilsCrossed className="w-4 h-4" />,
      badge: cartTotalCount > 0 ? cartTotalCount : undefined
    },
    { 
      role: 'cocina', 
      label: 'Cocina (KDS)', 
      icon: <ChefHat className="w-4 h-4" />,
      badge: kitchenPendingCount > 0 ? kitchenPendingCount : undefined
    },
    { 
      role: 'admin', 
      label: 'Administración', 
      icon: <BarChart3 className="w-4 h-4" />,
      badge: orders.length
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-lg border-b border-stone-800">
      {/* Top micro ribbon with Ecuadorian colors flag accent */}
      <div className="h-1 w-full flex">
        <div className="h-full bg-amber-400 w-1/2"></div>
        <div className="h-full bg-blue-600 w-1/4"></div>
        <div className="h-full bg-red-600 w-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Restaurant Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-900 font-black shadow-md border border-amber-300/40">
              <span className="text-xl sm:text-2xl">🍌</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white">
                  El Rincón del Bolón
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SRI Facturación
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 font-medium hidden sm:block">
                Desayunos Manabitas & Mariscos del Ecuador • Facturación Electrónica SRI
              </p>
            </div>
          </div>

          {/* Role Navigator switcher (Mesero / Cocina / Admin) - Visible on Tablets & Desktop */}
          <div className="hidden md:flex items-center bg-stone-800/80 p-1 rounded-xl border border-stone-700/60 shadow-inner">
            {roleConfigs.map((cfg) => {
              const isActive = activeRole === cfg.role;
              return (
                <button
                  key={cfg.role}
                  onClick={() => setActiveRole(cfg.role)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                  }`}
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                  {cfg.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        isActive
                          ? 'bg-stone-950 text-amber-400'
                          : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {cfg.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions: Cart trigger (if mobile/waiter), Reset demo, User profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Cart button for Waiter mode */}
            {activeRole === 'mesero' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:px-3.5 sm:py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition"
                title="Ver carrito de la orden"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span className="hidden sm:inline font-semibold">Orden</span>
                {cartTotalCount > 0 && (
                  <span className="bg-amber-500 text-stone-950 text-xs font-black px-1.5 py-0.5 rounded-full">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* Reset Demo Data button */}
            <button
              onClick={resetDemoData}
              className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition border border-transparent hover:border-stone-700"
              title="Restablecer datos quemados de prueba"
            >
              <RotateCcw className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>

            {/* User status & switch */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-800/60 pl-2 pr-1.5 py-1 rounded-xl border border-stone-700/50">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <p className="text-xs font-bold text-stone-200">{currentUser.name}</p>
                  <p className="text-[10px] text-amber-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-700 rounded-lg text-xs font-medium ml-1"
                  title="Cambiar usuario"
                >
                  <LogIn className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition shadow"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
