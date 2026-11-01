import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MOCK_USERS } from '../../data/initialOrders';
import { X, Lock, ShieldCheck, UserCheck, Utensils, ChefHat, BarChart3 } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, currentUser } = useRestaurant();
  const [selectedPresetId, setSelectedPresetId] = useState(MOCK_USERS[0].id);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSelectPreset = (userId: string) => {
    setSelectedPresetId(userId);
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      login(user);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to admin or first user if filled
    const user = MOCK_USERS.find((u) => u.id === selectedPresetId) || MOCK_USERS[0];
    login(user);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'mesero':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'cocina':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'admin':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      default:
        return <UserCheck className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-800 bg-stone-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">Acceso al Sistema</h3>
              <p className="text-xs text-stone-400">Selecciona un rol o perfil demo</p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Quick preset user selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              Perfiles Rápidos (Demo)
            </label>
            <div className="grid gap-2.5">
              {MOCK_USERS.map((user) => {
                const isCurrent = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectPreset(user.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-stone-800/70 border-stone-700/80 hover:bg-stone-800 hover:border-stone-600 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-stone-700"
                      />
                      <div>
                        <div className="font-bold text-sm text-stone-100 flex items-center gap-2">
                          {user.name}
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400">{user.title}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-700/50">
                      {getRoleIcon(user.role)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-800 w-full"></div>
            <span className="bg-stone-900 px-3 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              O credenciales manuales
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Usuario / Correo
              </label>
              <input
                type="text"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="ejemplo@restaurante.ec"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Iniciar Sesión en el Sistema</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
