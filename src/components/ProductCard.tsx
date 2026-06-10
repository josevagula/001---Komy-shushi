/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Clock, Flame, ChevronRight, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const hasDiscount = !!product.promoPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-150 dark:border-white/5 p-4 hover:shadow-xl hover:border-amber-550/30 dark:hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between cursor-pointer group h-full hover:shadow-amber-500/5"
    >
      {/* Product Image and badges */}
      <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 mb-3">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-zinc-950 font-bold text-[10px] tracking-wider uppercase px-2 py-1 rounded-md shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 fill-zinc-950" />
              Mais Vendido
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors pt-0.5">
            {product.name}
          </h4>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-105 dark:border-zinc-800/60">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-zinc-440 dark:text-zinc-505 line-through text-[11px] font-mono leading-none">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold text-base leading-tight font-mono">
                  R$ {product.promoPrice!.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              <span className="text-zinc-900 dark:text-zinc-200 font-extrabold text-base leading-tight font-mono">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          <button 
            id={`btn-customize-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-zinc-950 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 px-3.5 py-1.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 flex items-center gap-1 group-hover:bg-amber-500 group-hover:text-zinc-950 shadow-sm cursor-pointer"
          >
            Adicionar
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
