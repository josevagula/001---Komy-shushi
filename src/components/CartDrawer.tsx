/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingBasket, Plus, Minus, Edit2, Trash2, Check, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { CartItem, RestaurantConfig } from '../types';

interface CartDrawerProps {
  cart: CartItem[];
  config: RestaurantConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQty: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onEditCustomization: (item: CartItem) => void;
  onGoToCheckout: () => void;
  isStoreOpen?: boolean;
}

export default function CartDrawer({
  cart,
  config,
  isOpen,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onEditCustomization,
  onGoToCheckout,
  isStoreOpen = true
}: CartDrawerProps) {
  // Math Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Delivery fee logic
  const isFreeDeliveryThresholdMet = config.freeShippingThresh ? subtotal >= config.freeShippingThresh : false;
  
  const deliveryFee = isFreeDeliveryThresholdMet ? 0 : config.deliveryFee;

  // Grand Total
  const total = Math.max(0, subtotal + deliveryFee);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Cart Container Drawer */}
      <div 
        id="cart-drawer-container"
        className="relative w-full md:w-[460px] bg-[#0F0F0F] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="w-5.5 h-5.5 text-amber-500" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">Seu Carrinho</h3>
            <span className="bg-amber-550/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} itens
            </span>
          </div>
          <button id="close-cart" onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition-colors cursor-pointer">
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* List of elements */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <ShoppingBasket className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-lg">Seu carrinho está vazio</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-[280px] mx-auto">
                Explore nosso cardápio variado e adicione delícias irresistíveis para começar o seu pedido!
              </p>
            </div>
            <button 
              onClick={onClose}
              className="bg-zinc-900 text-white px-5 h-11 rounded-xl text-sm font-bold shadow-md hover:bg-amber-500 hover:text-zinc-950 transition-colors cursor-pointer pt-0.5"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              
              {/* Delivery Progress alerting Progress bar */}
              {config.freeShippingThresh && (
                <div className="p-3 bg-zinc-850 rounded-2xl border border-zinc-800 text-[12px]">
                  {isFreeDeliveryThresholdMet ? (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Parabéns, você atingiu o valor de Frete Grátis! 🎉
                    </div>
                  ) : (
                    <div>
                      <span className="text-zinc-500 block mb-1">
                        Faltam <strong className="text-white font-mono">R$ {(config.freeShippingThresh - subtotal).toFixed(2).replace('.', ',')}</strong> para ganhar <strong className="text-emerald-400">Frete Grátis!</strong>
                      </span>
                      <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-550 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / config.freeShippingThresh) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Items Card list */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.cartId}
                    className="p-3.5 rounded-2xl bg-zinc-850 border border-zinc-800 flex gap-3 shadow-sm hover:border-zinc-750 transition-colors"
                  >
                    {/* Item Image */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details and modifications */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate pr-2 pt-0.5">{item.product.name}</h4>
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-200 font-mono shrink-0">
                          R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Display modifiers */}
                      {item.customizationSummary && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 italic line-clamp-2">
                          {item.customizationSummary}
                        </p>
                      )}

                      {/* Instructions */}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-1 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Qty & Controls */}
                      <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Inline custom edit */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onEditCustomization(item)}
                            className="text-[10.5px] bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors group cursor-pointer font-medium"
                          >
                            <Edit2 className="w-3 h-3 group-hover:scale-110" />
                            Editar
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.cartId)}
                            className="text-[10.5px] text-zinc-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quantity picker */}
                        <div className="flex items-center gap-2 bg-zinc-900 py-1 px-2.5 rounded-xl border border-zinc-800">
                          <button 
                            onClick={() => onUpdateQty(item.cartId, item.quantity - 1)}
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 font-mono w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout breakdown info */}
            </div>

            {/* Calculations Breakdown and Proceed Checkout */}
            <div className="p-4 bg-[#0A0A0A] border-t border-white/5 space-y-4 shadow-inner">
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold font-mono text-zinc-300 text-sm">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-[11.5px]">
                    Taxa de Entregador
                  </span>
                  <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm uppercase">
                    Grátis
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-950 dark:text-white font-extrabold text-base pt-2.5 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-900 dark:text-zinc-100">Total do Pedido</span>
                  <span className="text-lg font-mono text-amber-600 dark:text-amber-400 font-black">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Closed Warning */}
              {!isStoreOpen ? (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200/20 text-center font-semibold text-[11px] flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-extrabold text-[10px]">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
                    Restaurante Fechado no Momento
                  </div>
                  <span className="font-medium text-zinc-500 dark:text-zinc-400">Aberto 24h todos os dias.</span>
                </div>
              ) : null}

              {/* Proceed CTA */}
              <button
                id="btn-checkout-trigger"
                onClick={onGoToCheckout}
                disabled={cart.length === 0 || !isStoreOpen}
                className="w-full bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-amber-400 text-zinc-950 font-bold h-13 rounded-2xl tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {!isStoreOpen ? "Fechado no Momento" : "Continuar para Entrega"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
