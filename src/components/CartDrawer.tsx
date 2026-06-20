/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, ShoppingBasket, Plus, Minus, Edit2, Trash2, Ticket, Check, ChevronRight, AlertCircle, ShoppingBag, Percent } from 'lucide-react';
import { CartItem, Coupon, RestaurantConfig } from '../types';

interface CartDrawerProps {
  cart: CartItem[];
  config: RestaurantConfig;
  coupons: Coupon[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQty: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onEditCustomization: (item: CartItem) => void;
  onGoToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  isStoreOpen?: boolean;
}

export default function CartDrawer({
  cart,
  config,
  coupons,
  isOpen,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onEditCustomization,
  onGoToCheckout,
  appliedCoupon,
  onApplyCoupon,
  isStoreOpen = true
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || '');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(appliedCoupon ? 'Cupom ativo com sucesso!' : null);

  // Math Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Delivery fee logic
  const isFreeDeliveryThresholdMet = config.freeShippingThresh ? subtotal >= config.freeShippingThresh : false;
  const isFreeDeliveryCoupon = appliedCoupon?.code === 'FRETEGRATIS' && subtotal >= (appliedCoupon.minOrderValue || 0);
  
  const deliveryFee = (isFreeDeliveryThresholdMet || isFreeDeliveryCoupon) ? 0 : config.deliveryFee;

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    const minVal = appliedCoupon.minOrderValue || 0;
    if (subtotal >= minVal) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
      } else if (appliedCoupon.discountType === 'fixed') {
        discount = appliedCoupon.value;
      }
    }
  }

  useEffect(() => {
    if (appliedCoupon && appliedCoupon.isActive) {
      const minVal = appliedCoupon.minOrderValue || 0;
      if (subtotal < minVal) {
        onApplyCoupon(null);
        setCouponSuccess(null);
        setCouponError(`Valor mínimo do cupom é R$ ${minVal.toFixed(2).replace('.', ',')}`);
      }
    }
  }, [subtotal, appliedCoupon]);

  // Grand Total
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const inputCode = couponCode.trim().toUpperCase();
    if (!inputCode) {
      onApplyCoupon(null);
      return;
    }

    const coupon = coupons.find(c => c.code === inputCode);

    if (!coupon) {
      setCouponError('Cupom inválido. Tente novamente.');
      onApplyCoupon(null);
      return;
    }

    if (!coupon.isActive) {
      setCouponError('Este cupom expirou.');
      onApplyCoupon(null);
      return;
    }

    const minNeeded = coupon.minOrderValue || 0;
    if (subtotal < minNeeded) {
      setCouponError(`Este cupom exige pedido mínimo de R$ ${minNeeded.toFixed(2).replace('.', ',')}`);
      onApplyCoupon(null);
      return;
    }

    onApplyCoupon(coupon);
    setCouponSuccess(couponCode === 'FRETEGRATIS' ? 'Frete Grátis aplicado com sucesso!' : 'Desconto aplicado!');
  };

  const handleClearCoupon = () => {
    onApplyCoupon(null);
    setCouponCode('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Cart Container Drawer */}
      <div 
        id="cart-drawer-container"
        className="relative w-full md:w-[460px] bg-white dark:bg-[#0F0F0F] border-l border-zinc-200 dark:border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50 dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="w-5.5 h-5.5 text-amber-500" />
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">Seu Carrinho</h3>
            <span className="bg-amber-550/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} itens
            </span>
          </div>
          <button id="close-cart" onClick={onClose} className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* List of elements */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
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
              className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 h-11 rounded-xl text-sm font-bold shadow-md hover:bg-amber-500 hover:text-zinc-950 transition-colors cursor-pointer pt-0.5"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              
              {/* Delivery Progress alerting Progress bar */}
              {config.freeShippingThresh && (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-[12px]">
                  {isFreeDeliveryThresholdMet ? (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      Parabéns, você atingiu o valor de Frete Grátis! 🎉
                    </div>
                  ) : (
                    <div>
                      <span className="text-zinc-500 block mb-1">
                        Faltam <strong className="text-zinc-900 dark:text-zinc-250 font-mono">R$ {(config.freeShippingThresh - subtotal).toFixed(2).replace('.', ',')}</strong> para ganhar <strong className="text-emerald-600 dark:text-emerald-400">Frete Grátis!</strong>
                      </span>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
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
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-850 border border-zinc-105 dark:border-zinc-800 flex gap-3 shadow-sm hover:border-zinc-200 dark:hover:border-zinc-750 transition-colors"
                  >
                    {/* Item Image */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-100 shrink-0"
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
                            className="text-[10.5px] bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 text-zinc-640 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-200 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors group cursor-pointer font-medium"
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
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 py-1 px-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
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

              {/* Coupon Section */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-zinc-400">
                      <Percent className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Cupom de desconto"
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-medium text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!couponCode.trim()}
                    className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Aplicar
                  </button>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleClearCoupon}
                      className="text-zinc-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                      title="Remover cupom"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                {couponError && (
                  <p className="text-[11px] text-red-500 font-medium mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {couponSuccess}
                  </p>
                )}
              </div>

              {/* Checkout breakdown info */}
            </div>

            {/* Calculations Breakdown and Proceed Checkout */}
            <div className="p-4 bg-zinc-50 dark:bg-[#0A0A0A] border-t border-zinc-200 dark:border-white/5 space-y-4 shadow-inner">
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold font-mono text-zinc-855 dark:text-zinc-300 text-sm">
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

               {/* Min Order Check Warning */}
              {subtotal < config.minOrder ? (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200/20 text-center font-medium text-[11px] flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Pedido Mínimo de R$ {config.minOrder.toFixed(2).replace('.', ',')} não atingido. Adicione mais R$ {(config.minOrder - subtotal).toFixed(2).replace('.', ',')}!
                </div>
              ) : null}

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
                disabled={subtotal < config.minOrder || cart.length === 0 || !isStoreOpen}
                className="w-full bg-amber-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 hover:bg-amber-400 text-zinc-950 font-bold h-13 rounded-2xl tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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
