/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Send, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { Order, RestaurantConfig } from '../types';

interface OrderConfirmationProps {
  order: Order;
  config: RestaurantConfig;
  onReset: () => void;
}

export default function OrderConfirmation({ order, config, onReset }: OrderConfirmationProps) {
  
  // Format the WhatsApp message content
  const generateWhatsappMessage = (): string => {
    const space = " ";
    const line = "\n";
    const divider = "================================";

    let text = `🚨 *NOVO PEDIDO NO KOMY SUSHI* 🚨${line}`;
    text += `${divider}${line}`;
    text += `*DATA:* ${order.date}${line}`;
    text += `${divider}${line}${line}`;

    text += `👤 *CLIENTE:*${line}`;
    text += `Nome: ${order.customer.name}${line}`;
    text += `WhatsApp: ${order.customer.phone}${line}${line}`;

    text += `🍱 *ITENS DO PEDIDO:*${line}`;
    order.items.forEach((item, index) => {
      text += `*${item.quantity}x ${item.product.name}*${line}`;
      if (item.customizationSummary) {
        text += `  └ _${item.customizationSummary}_${line}`;
      }
      if (item.specialInstructions) {
        text += `  └ Obs: _"${item.specialInstructions}"_${line}`;
      }
      text += `  └ Preço Unitário: R$ ${item.unitPrice.toFixed(2).replace('.', ',')}${line}`;
      text += `  └ Total Item: R$ ${item.totalPrice.toFixed(2).replace('.', ',')}${line}${line}`;
    });

    text += `${divider}${line}`;
    text += `💰 *EXTRATO FINANCEIRO:*${line}`;
    text += `*TOTAL A PAGAR: R$ ${order.total.toFixed(2).replace('.', ',')}*${line}`;
    text += `${divider}${line}${line}`;

    text += `🛵 *MEIO DE ENTREGA:*${line}`;
    if (order.deliveryType === 'delivery' && order.deliveryAddress) {
      const addr = order.deliveryAddress;
      text += `Delivery${line}`;
      text += `Endereço: ${addr.street}, nº ${addr.number}${line}`;
      if (addr.complement) text += `Complemento: ${addr.complement}${line}`;
      text += `Bairro: ${addr.neighborhood}${line}`;
    } else {
      text += `Retirada no Local — Rua América, Bairro Centro, Califórnia - PR, 86820-000${line}`;
    }
    text += `${divider}${line}${line}`;

    text += `💳 *PAGAMENTO:*${line}`;
    const pMethod = order.paymentMethod === 'pix' ? 'Pix' : order.paymentMethod === 'credit' ? 'Cartão de Crédito' : order.paymentMethod === 'debit' ? 'Cartão de Débito' : 'Dinheiro físico';
    text += `Forma: ${pMethod}${line}`;
    if (order.paymentMethod === 'cash') {
      if (order.changeNeededFor) {
        text += `Precisa de troco para: R$ ${order.changeNeededFor.toFixed(2).replace('.', ',')}${line}`;
        text += `Troco: R$ ${(order.changeNeededFor - order.total).toFixed(2).replace('.', ',')}${line}`;
      } else {
        text += `Troco: Não precisa de troco (Valor exato)${line}`;
      }
    }
    text += `${line}`;
    text += `${divider}${line}${line}`;
    text += `Obrigado pela preferência! Seu pedido começará a ser preparado em instantes. 🍣`;

    return encodeURIComponent(text);
  };

  const handleSendToWhatsapp = () => {
    // Standard WhatsApp merchant dial dispatch
    const encoded = generateWhatsappMessage();
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`;
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 text-center space-y-6">
      
      {/* Visual confirmation badge */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-18 h-18 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 fill-emerald-500/10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Pedido feito com Sucesso!</h2>
        <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
          Agora envie o seu pedido para o nosso WhatsApp para começarmos a preparar!
        </p>
      </div>

      {/* TORN PHYSICAL RECEIPTS INSPIRED CONTAINER */}
      <div className="relative bg-zinc-850/40 border border-zinc-800 rounded-3xl p-6 text-left shadow-lg overflow-hidden font-mono text-zinc-200">
        
        {/* Torn visual edges simulation top */}
        <div className="absolute top-0 inset-x-0 h-1.5 flex gap-1 bg-zinc-900">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-850/40 border-b border-zinc-800 aspect-square rounded-full -translate-y-[45%]" />
          ))}
        </div>

        {/* Receipt Header */}
        <div className="pt-2 text-center pb-4 border-b border-dashed border-zinc-300 dark:border-zinc-700/60 space-y-1 mt-1">
          <h3 className="font-extrabold text-base tracking-widest text-zinc-900 dark:text-white">KOMY SUSHI</h3>
          <span className="text-[9.5px] text-zinc-400 block">{order.date}</span>
        </div>

        {/* Sections items details list */}
        <div className="py-4 border-b border-dashed border-zinc-300 dark:border-zinc-700/60 space-y-3">
          <span className="text-[10.5px] font-bold uppercase text-zinc-400 tracking-wider block">ITENS DO HISTÓRICO:</span>
          {order.items.map((item) => (
            <div key={item.cartId} className="flex justify-between items-start text-xs">
              <div className="min-w-0 pr-4">
                <span className="font-bold">{item.quantity}x {item.product.name}</span>
                {item.customizationSummary && (
                  <p className="text-[10px] text-amber-600 truncate block mt-0.5">({item.customizationSummary})</p>
                )}
                {item.specialInstructions && (
                  <p className="text-[10px] text-zinc-400 truncate">"{item.specialInstructions}"</p>
                )}
              </div>
              <span className="font-semibold font-mono tracking-wider shrink-0">
                R$ {item.totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery brief */}
        <div className="py-3 border-b border-dashed border-zinc-300 dark:border-zinc-700/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">CLIENTE:</span>
            <span className="font-bold truncate text-right max-w-[160px]">{order.customer.name}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 shrink-0">ENTREGA:</span>
            <span className="font-semibold text-right max-w-[200px] text-[11px]">
              {order.deliveryType === 'delivery' ? 'Delivery' : 'Retirada no Local'}
            </span>
          </div>
          {order.deliveryType === 'delivery' && order.deliveryAddress && (
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 shrink-0">ENDEREÇO:</span>
              <span className="font-semibold text-right max-w-[200px] text-[11px] truncate">
                {order.deliveryAddress.street}, {order.deliveryAddress.number}
              </span>
            </div>
          )}
          {order.deliveryType === 'pickup' && (
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 shrink-0">RETIRADA:</span>
              <span className="font-semibold text-right max-w-[200px] text-[11px]">
                Rua América, Bairro Centro, Califórnia - PR, 86820-000
              </span>
            </div>
          )}
        </div>

        {/* Financial accounts and payments */}
        <div className="pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-zinc-900 dark:text-white font-extrabold text-sm pt-2 border-t border-dotted border-zinc-300 dark:border-zinc-750">
            <span>TOTAL LIQUIDO</span>
            <span className="font-bold font-mono text-amber-600 dark:text-amber-400">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
            <span>PAGO VIA:</span>
            <span className="font-bold uppercase tracking-wide">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Torn visual edges simulation bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 flex gap-1 bg-zinc-900">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-850/40 border-t border-zinc-800 aspect-square rounded-full translate-y-[45%]" />
          ))}
        </div>
      </div>

      {/* Call to actions tools */}
      <div className="flex flex-col gap-3 max-w-sm mx-auto pt-3">
        
        {/* BIG WA ACTION TRIGGER */}
        <button
          onClick={handleSendToWhatsapp}
          className="bg-emerald-600 hover:bg-emerald-500 text-white h-13 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Send className="w-5 h-5 fill-white shrink-0 animate-bounce" />
          Enviar Pedido para WhatsApp
        </button>

        {/* Visual restart button */}
        <button
          onClick={onReset}
          className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-semibold py-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Cardápio Inicial
        </button>
      </div>

      {/* Floating clock estimator */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3.5 max-w-xs mx-auto flex items-center gap-3 text-xs text-amber-700 dark:text-amber-300">
        <Clock className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="text-left leading-relaxed">
          <span className="font-bold block">Tempo de Entrega Estimado:</span>
          {config.deliveryTime} a partir das 19h.
        </div>
      </div>
    </div>
  );
}
