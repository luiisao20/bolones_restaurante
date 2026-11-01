import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { Role } from '../../types';
import { UtensilsCrossed, ChefHat, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeRole, setActiveRole, orders, cartTotalCount } = useRestaurant();

  // Active kitchen orders
  const kitchenPendingCount = orders.filter(
    (o) => o.status === 'recien ordenado' || o.status === 'preparando'
  ).length;

  const navItems: { role: Role; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      role: 'mesero',
      label: 'Mesero',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      badge: cartTotalCount > 0 ? cartTotalCount : undefined,
    },
    {
      role: 'cocina',
      label: 'Cocina',
      icon: <ChefHat className="w-5 h-5" />,
      badge: kitchenPendingCount > 0 ? kitchenPendingCount : undefined,
    },
    {
      role: 'admin',
      label: 'Admin',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: orders.length,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 md:hidden pb-safe">
      <div className="grid grid-cols-3 h-16 items-center px-2">
        {navItems.map((item) => {
          const isActive = activeRole === item.role;
          return (
            <button
              key={item.role}
              onClick={() => setActiveRole(item.role)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all ${
                isActive ? 'text-amber-400 font-extrabold scale-105' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-black px-1.5 py-0.2 rounded-full leading-tight shadow-sm ${
                      isActive
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-amber-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
