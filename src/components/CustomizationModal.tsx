/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Info, ClipboardList, Check, ShoppingBag } from 'lucide-react';
import { Product, Topping, CartItem } from '../types';

interface CustomizationModalProps {
  product: Product;
  editItem?: CartItem; // If editing an existing cart item
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customizedItem: CartItem) => void;
}

export default function CustomizationModal({ product, editItem, isOpen, onClose, onConfirm }: CustomizationModalProps) {
  // Initialize states
  const baseSelectedPrice = product.promoPrice || product.price;
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Determine which customization options to show based on product config
  const isCustomizationEnabled = product.customization?.enabled !== false;
  const removalItems = isCustomizationEnabled
    ? (product.customization?.removableIngredients ?? product.ingredients)
    : [];
  const addableSource = isCustomizationEnabled
    ? (product.customization?.addableIngredients ?? product.availableToppings)
    : [];

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        // Prepare from existing cart entry
        setQuantity(editItem.quantity);
        setToppings(editItem.addedToppings || []);
        setRemovedIngredients(editItem.removedIngredients || []);
        setSpecialInstructions(editItem.specialInstructions || '');
      } else {
        // Prepare defaults for new item
        setQuantity(1);
        setSpecialInstructions('');
        setRemovedIngredients([]);
        
        // Build topping options from the applicable source
        const initialToppings = (addableSource || []).map((t, idx) => ({
          id: `t-${idx}-${t.name}`,
          name: t.name,
          price: t.price,
          quantity: 0,
          maxQuantity: t.max || 5
        }));
        setToppings(initialToppings);
      }
    }
  }, [isOpen, product, editItem]);

  // Calculate prices dynamically
  const toppingsCost = (toppings || []).reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const singleUnitPrice = baseSelectedPrice + toppingsCost;
  const totalItemCost = singleUnitPrice * quantity;

  const handleToppingQtyChange = (toppingId: string, delta: number) => {
    setToppings(prev => prev.map(t => {
      if (t.id === toppingId) {
        const nextQty = Math.max(0, Math.min(t.maxQuantity || 5, t.quantity + delta));
        return { ...t, quantity: nextQty };
      }
      return t;
    }));
  };

  const handleRemovalToggle = (ingredient: string) => {
    setRemovedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleConfirm = () => {
    // Generate description list of customizations
    const activeToppings = (toppings || []).filter(t => t.quantity > 0);
    const addedText = activeToppings.map(t => `+${t.quantity}x ${t.name}`).join(', ');
    const removedText = removedIngredients.map(i => `Sem ${i}`).join(', ');
    
    let summary = '';
    if (addedText && removedText) {
      summary = `${addedText} | ${removedText}`;
    } else if (addedText) {
      summary = addedText;
    } else if (removedText) {
      summary = removedText;
    }

    const payload: CartItem = {
      cartId: editItem?.cartId || `cart-${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity,
      addedToppings: activeToppings,
      removedIngredients,
      specialInstructions,
      customizationSummary: summary,
      unitPrice: singleUnitPrice,
      totalPrice: totalItemCost
    };

    onConfirm(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="customization-modal-container"
        className="bg-[#0F0F0F] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Banner */}
        <div className="relative h-44 bg-zinc-800 shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button 
            id="close-customize"
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-amber-400 font-bold text-xs tracking-wider uppercase bg-amber-500/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/20">
              {product.categories?.[0] || ''}
            </span>
            <h3 className="text-white font-extrabold text-xl mt-1.5 leading-tight">{product.name}</h3>
            <p className="text-zinc-300 text-xs mt-0.5 line-clamp-1">{product.description}</p>
          </div>
        </div>

        {/* Customization Details Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Base Ingredients Removals */}
          {removalItems && removalItems.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                Remover Ingredientes
                <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-normal lowercase">(Opcional)</span>
              </h4>
              <p className="text-xs text-zinc-400 mb-3">Selecione o que você gostaria de retirar do seu prato:</p>
              
              <div className="flex flex-wrap gap-2.5">
                {removalItems.map((ingredient) => {
                  const isRemoved = removedIngredients.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => handleRemovalToggle(ingredient)}
                      className={`text-xs px-3.5 py-2 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isRemoved
                          ? 'bg-red-950/20 text-red-400 border-red-900/40 line-through'
                          : 'bg-zinc-850 text-zinc-300 border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      {isRemoved ? 'Remover ' : ''}{ingredient}
                      {isRemoved && <X className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Toppings Accordion */}
          {toppings && toppings.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                Adicionais Extras
                <span className="text-amber-500 text-[11px] font-normal lowercase">(Turbine seu prato!)</span>
              </h4>
              <p className="text-xs text-zinc-400 mb-4">Escolha os itens que deseja adicionar (limite de até 5 de cada):</p>
              
              <div className="space-y-3.5">
                {toppings.map((topping) => (
                  <div 
                    key={topping.id} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-200">{topping.name}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 block font-mono font-medium mt-0.5">
                        + R$ {topping.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToppingQtyChange(topping.id, -1)}
                        disabled={topping.quantity === 0}
                        className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center text-zinc-100 font-mono">
                        {topping.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToppingQtyChange(topping.id, 1)}
                        disabled={topping.quantity >= (topping.maxQuantity || 5)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observations and instructions */}
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <ClipboardList className="w-4 h-4 text-amber-500" />
              Observações Especiais
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ex: Ponto da carne mal passado, extra molho verde, mandar sachê de geleia de pimenta..."
              maxLength={140}
              className="w-full bg-zinc-850 border border-zinc-800 rounded-2xl p-3 text-sm text-zinc-200 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 placeholder:text-zinc-400"
              rows={2}
            />
            <div className="text-[10.5px] text-zinc-400 text-right font-mono mt-1">
              {specialInstructions.length}/140 caracteres
            </div>
          </div>
        </div>

        {/* Footer Subtotal & Action Bar */}
        <div className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs text-zinc-400 block pb-0.5">Valor Unitário</span>
              <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                R$ {singleUnitPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Overall quantity controller */}
            <div className="flex items-center gap-3.5 bg-[#0F0F0F] border border-white/5 py-1.5 px-3.5 rounded-2xl shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-zinc-600 dark:text-zinc-300 p-0.5 hover:text-amber-500 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 font-mono w-6 text-center">
                {quantity}x
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="text-zinc-600 dark:text-zinc-300 p-0.5 hover:text-amber-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            id="confirm-customization"
            type="button"
            onClick={handleConfirm}
            className="w-full bg-amber-500 hover:bg-amber-400 dark:bg-amber-500 text-zinc-950 h-13 rounded-2xl font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 fill-zinc-950" />
            {editItem ? 'Salvar Alterações' : 'Adicionar ao Carrinho'}
            <span className="font-mono text-sm ml-1.5 opacity-90 pl-2 border-l border-zinc-900/25">
              R$ {totalItemCost.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
