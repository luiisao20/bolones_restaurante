import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES_CONFIG } from '../../data/dishes';
import type { Dish, Category } from '../../types';
import { 
  Search, 
  X, 
  Plus, 
  Minus, 
  Clock, 
  Flame, 
  UtensilsCrossed, 
  Coffee, 
  Fish, 
  Soup, 
  Citrus, 
  CupSoda, 
  Beer,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const MenuGrid: React.FC = () => {
  const { 
    filteredDishes, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    cart,
    addToCart,
    updateCartQuantity,
    setIsCartOpen,
    cartTotalCount,
    cartTotal
  } = useRestaurant();

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'bolones': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'desayunos': return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'mariscos': return <Fish className="w-4 h-4 text-cyan-500" />;
      case 'carta': return <Soup className="w-4 h-4 text-emerald-500" />;
      case 'jugos': return <Citrus className="w-4 h-4 text-yellow-500" />;
      case 'bebidas': return <CupSoda className="w-4 h-4 text-blue-400" />;
      case 'cervezas': return <Beer className="w-4 h-4 text-amber-400" />;
      default: return <UtensilsCrossed className="w-4 h-4 text-stone-400" />;
    }
  };

  const getItemQuantityInCart = (dishId: string) => {
    const item = cart.find((i) => i.dishId === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      
      {/* Search and Category Filter Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por platillo, ingrediente o marisco (ej. Bolón, Encebollado, Maracuyá, Pilsener)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-stone-50 border border-stone-300/80 text-stone-800 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-inner min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 border border-stone-200/60'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Match Counter Info */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span>Mostrando <strong>{filteredDishes.length}</strong> platillos y bebidas</span>
          {searchQuery && (
            <span className="text-amber-700 font-medium">
              Filtro: "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* Dishes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredDishes.map((dish: Dish) => {
          const qtyInCart = getItemQuantityInCart(dish.id);
          const itemEstimatedTotal = Number((qtyInCart * dish.price).toFixed(2));

          return (
            <div
              key={dish.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                qtyInCart > 0
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-stone-200/90 hover:border-amber-300'
              }`}
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {dish.badge && (
                      <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                        {dish.badge}
                      </span>
                    )}
                    {dish.isPopular && !dish.badge && (
                      <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </div>

                  {/* Preparation Time */}
                  {dish.preparationTime && (
                    <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-stone-700/50">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {dish.preparationTime}
                    </div>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-xl font-extrabold text-white drop-shadow-md">
                      ${dish.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-stone-200 ml-1 font-medium drop-shadow">USD</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-base text-stone-900 line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="p-4 pt-1 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                {qtyInCart > 0 ? (
                  <>
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold text-stone-500">Estimado platillo:</p>
                      <p className="text-xs font-bold text-amber-700">
                        {qtyInCart} × ${dish.price.toFixed(2)} = <span className="text-sm font-black text-stone-900">${itemEstimatedTotal.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-200/90 p-1 rounded-xl">
                      <button
                        onClick={() => updateCartQuantity(dish.id, -1)}
                        className="w-9 h-9 bg-white hover:bg-stone-100 text-stone-800 rounded-lg flex items-center justify-center font-black shadow-sm transition active:scale-90"
                        title="Disminuir"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-stone-900">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(dish.id, 1)}
                        className="w-9 h-9 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg flex items-center justify-center font-black shadow-sm transition active:scale-90"
                        title="Aumentar"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => addToCart(dish)}
                    className="w-full py-3 px-3.5 bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-extrabold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm active:scale-95 min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar a la Orden</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500 space-y-3">
          <Search className="w-10 h-10 mx-auto text-stone-300" />
          <p className="text-base font-semibold text-stone-700">No se encontraron platillos con esa búsqueda</p>
          <p className="text-xs text-stone-400">Intenta con otro término o limpia los filtros</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Floating Bottom Bar for Mobile / Quick Access */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-20 md:bottom-4 inset-x-3 sm:inset-x-6 lg:hidden z-30 animate-in slide-in-from-bottom duration-200">
          <div className="bg-stone-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">
                  {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'} seleccionados
                </p>
                <p className="text-base font-black text-amber-400">
                  Total est.: ${cartTotal.toFixed(2)} <span className="text-[10px] text-stone-400 font-normal">(IVA inc.)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-1.5"
            >
              <span>Ver Pedido</span>
              <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping"></span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
