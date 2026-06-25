/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, Clock, ShoppingBag, Bot, User, LayoutDashboard, Sparkles, Check, 
  MapPin, DollarSign, Store, Phone, HelpCircle, ShoppingCart, Percent, 
  ChevronRight, AlertCircle, Volume2
} from 'lucide-react';

import { Product, CartItem, Order, RestaurantConfig } from './types';
import { initialProducts, initialRestaurantConfig } from './data/initialData';

// Component imports
import ProductCard from './components/ProductCard';
import CustomizationModal from './components/CustomizationModal';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderConfirmation from './components/OrderConfirmation';

export default function App() {
  // Business core states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('komy-sushi-products');
    const loaded = saved ? JSON.parse(saved) : initialProducts;
    const migrated = loaded.map((p: any) => {
      if (p.categories) {
        return p as Product;
      }
      if (p.category) {
        const catLower = p.category.toLowerCase();
        const catMap: Record<string, string[]> = {
          'promoções': ['Destaques'],
          'promocoes': ['Destaques'],
          'sushis': ['Sushis'],
          'bebidas': ['Bebidas'],
          'êxodo': ['Bebidas'],
          'exodo': ['Bebidas'],
        };
        return { ...p, categories: catMap[catLower] || [p.category], category: undefined };
      }
      return p;
    });
    return migrated;
  });

  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('komy-sushi-config');
    const parsed = saved ? JSON.parse(saved) : initialRestaurantConfig;
    if (parsed) {
      parsed.whatsappNumber = "554396787495";
    }
    return parsed;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('komy-sushi-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('komy-sushi-orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation and UI control states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Destaques');
  const [searchQuery, setSearchQuery] = useState<string>('');


  // Modal / Sidebar triggers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Persistence hooks
  useEffect(() => {
    const validCategorySet = new Set(['destaques', 'entradas', 'hots', 'salmão', 'salmao', 'temaki', 'sushis', 'combos', 'pokes', 'especiais', 'bebidas']);
    const hasStaleCategories = products.some(p => {
      return !p.categories || p.categories.length === 0 || p.categories.some(c => !validCategorySet.has(c.toLowerCase()));
    });
    const hasOutdatedImages = products.some(p => {
      const initial = initialProducts.find(ip => ip.id === p.id);
      return initial && initial.image !== p.image;
    });
    const hasStaleCustomization = products.some(p => {
      const initial = initialProducts.find(ip => ip.id === p.id);
      return initial && JSON.stringify(initial.customization) !== JSON.stringify(p.customization);
    });

    if (hasStaleCategories || hasOutdatedImages || hasStaleCustomization || products.length !== initialProducts.length) {
      setProducts(initialProducts);
      localStorage.setItem('komy-sushi-products', JSON.stringify(initialProducts));
    }

    // Force sync of initial banner or config changes if needed
    if (config.banner !== initialRestaurantConfig.banner || config.deliveryTime !== initialRestaurantConfig.deliveryTime || config.minOrder !== initialRestaurantConfig.minOrder) {
      setConfig(prev => ({ 
        ...prev, 
        banner: initialRestaurantConfig.banner,
        deliveryTime: initialRestaurantConfig.deliveryTime,
        minOrder: initialRestaurantConfig.minOrder
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('komy-sushi-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('komy-sushi-config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('komy-sushi-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('komy-sushi-orders', JSON.stringify(orders));
  }, [orders]);

  
  // Helper to check if the store is open based strictly on schedule
  // Open 24/7 every day
  const isStoreOpenBySchedule = (): { isOpen: boolean; reason: string } => {
    return { isOpen: true, reason: "" };
  };

  const scheduleStatus = isStoreOpenBySchedule();
  const isStoreOpen = config.isOpen && scheduleStatus.isOpen;

  // Categories list based on our product data
  const categoriesList = [
    { name: 'Destaques', icon: '⭐', description: 'Os itens mais pedidos e favoritos do nosso cardápio' },
    { name: 'Entradas', icon: '🥗', description: 'Entradas leves e refrescantes para começar' },
    { name: 'Hots', icon: '🔥', description: 'Hots variados — tradicionais, crispy, temakis e mais' },
    { name: 'Salmão', icon: '🐟', description: 'Sashimis e salmão maçaricado em porções' },
    { name: 'Temaki', icon: '🌯', description: 'Temakis clássicos e especiais' },
    { name: 'Sushis', icon: '🍣', description: 'Niguiris, joys, uramakis, hossomakis e mais' },
    { name: 'Combos', icon: '🍱', description: 'Combos e combinados para compartilhar' },
    { name: 'Pokes', icon: '🥣', description: 'Pokes frescos e saborosos' },
    { name: 'Especiais', icon: '✨', description: 'Barcas, burgers, ichigo, pote da felicidade e molhos' },
    { name: 'Bebidas', icon: '🥤', description: 'Refrigerantes gelados' }
  ];

  // Ordered product IDs per category for correct display order
  const categoryProductOrder: Record<string, string[]> = {
    Destaques: ['hot-1', 'hot-6'],
    Entradas: ['sunomono-1'],
    Hots: ['hot-1', 'hot-2', 'hot-3', 'hot-4', 'hot-5', 'hot-7', 'hot-6'],
    Salmão: ['sashimi-1', 'sashimi-2', 'sashimi-3', 'sashimi-4', 'sashimi-5', 'sashimi-6'],
    Temaki: ['hot-6', 'hot-7', 'temaki-1', 'temaki-2', 'temaki-3'],
    Sushis: ['sushi-1', 'sushi-2', 'sushi-3', 'sushi-4', 'sushi-5', 'sushi-6', 'sushi-7', 'sushi-8', 'sushi-9', 'sushi-10'],
    Combos: ['combo-1', 'combo-2', 'combo-3', 'combo-4', 'combo-5', 'combo-6', 'comb-1', 'comb-2', 'comb-3', 'comb-4', 'comb-5'],
    Pokes: ['poke-1', 'poke-2'],
    Especiais: ['barca-1', 'burger-1', 'burger-2', 'special-1', 'sweet-1', 'adicional-1'],
    Bebidas: ['bebida-1', 'bebida-2', 'bebida-3', 'bebida-4', 'bebida-5', 'bebida-7', 'bebida-8']
  };

  // Cart operations
  const handleAddOrUpdateCart = (customizedItem: CartItem) => {
    setCart(prev => {
      const exactIdx = prev.findIndex(item => item.cartId === customizedItem.cartId);
      if (exactIdx > -1) {
        const next = [...prev];
        next[exactIdx] = customizedItem;
        return next;
      }
      const sameProduct = prev.findIndex(item =>
        item.product.id === customizedItem.product.id &&
        JSON.stringify(item.addedToppings) === JSON.stringify(customizedItem.addedToppings) &&
        JSON.stringify(item.removedIngredients) === JSON.stringify(customizedItem.removedIngredients) &&
        item.specialInstructions === customizedItem.specialInstructions
      );
      if (sameProduct > -1) {
        const next = [...prev];
        next[sameProduct] = {
          ...next[sameProduct],
          quantity: next[sameProduct].quantity + customizedItem.quantity,
          totalPrice: next[sameProduct].unitPrice * (next[sameProduct].quantity + customizedItem.quantity)
        };
        return next;
      }
      return [...prev, customizedItem];
    });
    setSelectedProduct(null);
    setEditingCartItem(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (cartId: string, nextQty: number) => {
    if (nextQty <= 0) {
      handleRemoveCartItem(cartId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return {
          ...item,
          quantity: nextQty,
          totalPrice: item.unitPrice * nextQty
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleEditCartItemSetup = (item: CartItem) => {
    setEditingCartItem(item);
    setSelectedProduct(item.product);
    setIsCartOpen(false); // Close cart sidebar to make room for editing modal
  };

  // Math totals aggregates for the order
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const isFreeDeliveryThresholdMet = config.freeShippingThresh ? cartSubtotal >= config.freeShippingThresh : false;
  const calculatedDeliveryFee = isFreeDeliveryThresholdMet ? 0 : config.deliveryFee;

  const grandTotal = cartSubtotal + calculatedDeliveryFee;

  // Confirm order processing and checkout final transition
  const handleCompleteOrderDispatch = (formData: {
    customer: any;
    deliveryType: 'delivery' | 'pickup';
    address?: any;
    paymentMethod: any;
    changeNeededFor?: number;
  }) => {
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    const formattedDate = new Date().toLocaleString('pt-BR');

    const finalizedOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: randomOrderNumber,
      date: formattedDate,
      items: cart,
      customer: formData.customer,
      deliveryType: formData.deliveryType,
      deliveryAddress: formData.address,
      paymentMethod: formData.paymentMethod,
      changeNeededFor: formData.changeNeededFor,
      subtotal: cartSubtotal,
      deliveryFee: calculatedDeliveryFee,
      total: grandTotal,
      status: 'pending'
    };

    setOrders(prev => [...prev, finalizedOrder]);
    setCurrentOrder(finalizedOrder);
    setCart([]); // Clear cart
    setIsCheckoutView(false);
  };

  const handleResetApp = () => {
    setCurrentOrder(null);
    setIsCheckoutView(false);
    setCart([]);
  };

  // Filtered menu display list
  const displayedProducts = products
    .filter(p => {
      const matchesCategory = p.categories && p.categories.some(c => c.toLowerCase() === activeCategory.toLowerCase());
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const order = categoryProductOrder[activeCategory] || [];
      const ia = order.indexOf(a.id);
      const ib = order.indexOf(b.id);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col font-sans">
      
      {/* NAVBAR */}
      <header className="sticky top-0 bg-[#121212]/80 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & title brand */}
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={handleResetApp}>
            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shadow-md">
              <img 
                src={config.logo} 
                alt={config.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest text-white uppercase leading-none">
                {config.name}
              </h1>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wide mt-0.5 block">
                DELIVERY • CARDÁPIO DIGITAL
              </span>
            </div>
          </div>

          {/* Quick Operations toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button wrapper */}
            {cart.length > 0 && !isCheckoutView && !currentOrder && (
              <button
                id="header-cart-button"
                onClick={() => setIsCartOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-zinc-950 fill-zinc-950" />
                <span className="font-mono">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RENDER VIEW CONTROLLER */}
      <main className="flex-1">
        
        {/* VIEW 1: DISPATCH CELEBRATION RECEIPT */}
        {currentOrder ? (
          <OrderConfirmation 
            order={currentOrder} 
            config={config} 
            onReset={handleResetApp} 
          />
        ) : isCheckoutView ? (
          
          /* VIEW 2: FORM FOR PAYMENT AND CEP */
          <CheckoutView
            cart={cart}
            subtotal={cartSubtotal}
            deliveryFee={calculatedDeliveryFee}
            total={grandTotal}
            onBackToCart={() => {
              setIsCheckoutView(false);
              setIsCartOpen(true);
            }}
            onConfirmOrder={handleCompleteOrderDispatch}
          />
        ) : (
          
          /* VIEW 3: HOMEPAGE AND CHANNELS (CATALOGUE) */
          <div className="space-y-8 pb-20">
            
            {/* HERO RESTAURANT BANNER */}
            <section className="max-w-7xl mx-auto px-4 mt-6">
              <div className="relative w-full h-60 md:h-80 bg-zinc-950 rounded-3xl overflow-hidden shadow-xl border border-white/5 group">
                <img 
                  src={config.banner} 
                  alt="Banner Comercial" 
                  className="w-full h-full object-cover opacity-10 group-hover:scale-[1.02] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />

                {/* Floating Meta Profile Info */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6 z-20">
                  <div className="space-y-2 text-left text-white drop-shadow-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-md shadow-orange-glow-sm">
                        Sushi Premium
                      </span>
                      
                      {/* Operational Shop state */}
                      {isStoreOpen ? (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                          Aberto Agora
                        </span>
                      ) : (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider bg-red-600 text-white px-2.5 py-1 rounded-md shadow-md">
                          🔒 {!config.isOpen ? "Fechado Temporariamente" : scheduleStatus.reason}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                      {config.name}
                    </h2>
                    <p className="text-zinc-200 dark:text-zinc-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Info Pills values strip */}
                  <div className="flex flex-wrap gap-2.5 bg-[#0F0F0F]/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/5 text-zinc-200 text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>{config.deliveryTime}</span>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-800">|</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Entrega Grátis</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORIES NAVIGATION MENU PILLS */}
            <section className="max-w-7xl mx-auto px-4 sticky top-16 bg-[#0A0A0A]/80 backdrop-blur-md py-4 z-30 border-b border-white/5">
              <div className="flex gap-2 bg-[#0F0F0F] p-1.5 rounded-2xl border border-white/5 select-none overflow-x-auto whitespace-nowrap scrollbar-none">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`px-4.5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 font-black shadow-md scale-102'
                          : 'text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-base leading-none">{cat.icon}</span>
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* DYNAMIC CARD CATALOGUE GRID */}
            <section className="max-w-7xl mx-auto px-4 space-y-6">
              
              {/* Filter details sub-header search bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white capitalize flex items-center gap-1.5">
                    {categoriesList.find(c=>c.name.toLowerCase() === activeCategory.toLowerCase())?.icon || '🍣'} {activeCategory}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {categoriesList.find(c=>c.name.toLowerCase() === activeCategory.toLowerCase())?.description}
                  </p>
                </div>

                {/* Inline Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3.5 top-3.5 text-zinc-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar no cardápio..."
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-amber-500 outline-none placeholder:text-zinc-400 font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3 text-xs text-zinc-400 hover:text-zinc-200 font-bold cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Items listing card grid */}
              {displayedProducts.length === 0 ? (
                <div className="p-14 text-center bg-[#0F0F0F] border border-white/5 rounded-3xl space-y-3.5">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Nenhum resultado encontrado</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Não encontramos pratos correspondentes aos filtros em "{activeCategory}". Tente outra pesquisa ou explore as abas acima.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((p) => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onSelect={(prod) => {
                        setSelectedProduct(prod);
                        setEditingCartItem(null);
                      }} 
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* FLOAT OPERATIONAL BUTTONS BAR */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 p-1">
        
        {/* Dynamic Cart Summary Footer overlay Bar (Ideal layout for mobile ease) */}
        {cart.length > 0 && !isCheckoutView && !currentOrder && (
          <button
            id="mobile-cart-float"
            onClick={() => setIsCartOpen(true)}
            className="md:hidden bg-amber-500 text-zinc-950 h-14 rounded-full flex items-center justify-between px-5 shadow-2.5xl font-bold cursor-pointer transition-all hover:scale-102 border border-amber-600/20 w-fit gap-4 mx-auto"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 fill-zinc-950" />
              <span className="text-xs bg-zinc-950 text-white font-mono rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
                {cart.reduce((s,i)=>s+i.quantity,0)}
              </span>
            </div>
            <span className="text-xs tracking-wider uppercase">Ver Sacola</span>
            <span className="font-mono text-sm leading-none">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
          </button>
        )}
      </div>

      {/* RENDER DYNAMIC FLOATING INTERACTIVE MODALS */}
      
      {/* 1. Customization modal (Toppings, Removals, Instructions) */}
      {selectedProduct && (
        <CustomizationModal
          product={selectedProduct}
          editItem={editingCartItem || undefined}
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setEditingCartItem(null);
          }}
          onConfirm={handleAddOrUpdateCart}
        />
      )}

      {/* 2. Slide out Shopping Cart Drawer */}
      <CartDrawer
        cart={cart}
        config={config}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onEditCustomization={handleEditCartItemSetup}
        onGoToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutView(true);
        }}
        isStoreOpen={isStoreOpen}
      />


    </div>
  );
}
