/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, MapPin, CreditCard, ShoppingBag, Landmark, Coins, Check, AlertCircle, Copy, Info } from 'lucide-react';
import { CartItem, CustomerInfo, AddressInfo, PaymentMethod, Coupon } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  onBackToCart: () => void;
  onConfirmOrder: (orderPayload: {
    customer: CustomerInfo;
    deliveryType: 'delivery' | 'pickup';
    address?: AddressInfo;
    paymentMethod: PaymentMethod;
    changeNeededFor?: number;
  }) => void;
}

export default function CheckoutView({
  cart,
  subtotal,
  deliveryFee,
  discount,
  total,
  appliedCoupon,
  onBackToCart,
  onConfirmOrder
}: CheckoutViewProps) {
  // Steps: 1: Info & Delivery, 2: Payment, 3: Review
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Fields state
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });

  const [address, setAddress] = useState<AddressInfo>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP'
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeForValue, setChangeForValue] = useState<string>('');

  // Card details mock states for UX
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // For Pix QR simulation copy
  const [pixCopied, setPixCopied] = useState(false);
  const pixKey = "00020126360014br.gov.bcb.pix01145511999999999520400005303986540552.005802BR5915KomyShusi6009SaoPaulo62070503***6304ECE3";

  // Address lookup simulator
  const handleCepLookup = (cepInput: string) => {
    const formatted = cepInput.replace(/\D/g, '');
    setAddress(prev => ({ ...prev, cep: formatted.replace(/(\d{5})(\d{3})/, '$1-$2') }));
    
    if (formatted.length === 8) {
      setCepLoading(true);
      setCepError(null);
      
      // Simulate look up
      setTimeout(() => {
        setCepLoading(false);
        // Standard high-conversion auto-population simulated database
        if (formatted === '01310100' || formatted.startsWith('013')) {
          setAddress(prev => ({
            ...prev,
            street: 'Avenida Paulista',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP'
          }));
        } else if (formatted === '22041001' || formatted.startsWith('22')) {
          setAddress(prev => ({
            ...prev,
            street: 'Avenida Atlântica',
            neighborhood: 'Copacabana',
            city: 'Rio de Janeiro',
            state: 'RJ'
          }));
        } else if (formatted === '30130010' || formatted.startsWith('30')) {
          setAddress(prev => ({
            ...prev,
            street: 'Avenida Afonso Pena',
            neighborhood: 'Centro',
            city: 'Belo Horizonte',
            state: 'MG'
          }));
        } else {
          // generic fallback mock address to keep process fully ready and easy to test
          setAddress(prev => ({
            ...prev,
            street: 'Rua das Flores Premium',
            neighborhood: 'Bairro Jardim Alegre',
            city: 'Cidade Exemplo',
            state: 'SP'
          }));
        }
      }, 700);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const isStep1Valid = () => {
    const isClientInfoOk = !!(customer.name.trim() && customer.phone.trim());
    return isClientInfoOk && !!(address.street.trim() && address.number.trim() && address.neighborhood.trim());
  };

  const isStep2Valid = () => {
    if (paymentMethod === 'cash') {
      if (needsChange === null) return false;
      if (needsChange) {
        const valueNum = parseFloat(changeForValue.replace(',', '.'));
        return !isNaN(valueNum) && valueNum > total;
      }
    }
    return true; // No credentials or online payments needed on client side
  };

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      setStep(3);
    }
  };

  const handleConfirm = () => {
    const finalChangeValue = (paymentMethod === 'cash' && needsChange && changeForValue)
      ? parseFloat(changeForValue.replace(',', '.'))
      : undefined;

    onConfirmOrder({
      customer,
      deliveryType,
      address: deliveryType === 'delivery' ? address : undefined,
      paymentMethod,
      changeNeededFor: finalChangeValue
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onBackToCart();
          }}
          className="p-2.5 rounded-xl bg-zinc-100 dark:bg-[#0F0F0F] hover:bg-zinc-200 dark:hover:bg-[#121212] border dark:border-white/5 text-zinc-700 dark:text-zinc-250 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Checkout</span>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5 leading-tight">Finalizar Pedido</h2>
        </div>
      </div>

      {/* Checkout step progress indicators */}
      <div className="flex items-center justify-between mb-8 px-2 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-200 text-zinc-500'}`}>1</div>
          <span className="text-[11px] font-bold text-zinc-630 dark:text-zinc-400">Dados & Entrega</span>
        </div>
        <div className="flex-1 h-0.5 bg-zinc-200 dark:bg-zinc-800 mx-2 mb-4" />
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-200 text-zinc-500'}`}>2</div>
          <span className="text-[11px] font-bold text-zinc-630 dark:text-zinc-400">Pagamento</span>
        </div>
        <div className="flex-1 h-0.5 bg-zinc-200 dark:bg-zinc-800 mx-2 mb-4" />
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-200 text-zinc-500'}`}>3</div>
          <span className="text-[11px] font-bold text-zinc-630 dark:text-zinc-400">Revisão Final</span>
        </div>
      </div>

      {/* Card Content block */}
      <div className="bg-white dark:bg-[#0F0F0F] border border-zinc-150 dark:border-white/10 rounded-3xl p-5 md:p-7 shadow-lg">
        
        {/* STEP 1: CLIENT AND SHIP ADDRESS */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* Contact Details */}
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-800 pb-2">1. Seus Dados de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500">Nome Completo</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    required
                    placeholder="Ex: João da Silva Santos"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    required
                    placeholder="Ex: (11) 99999-9999"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Delivery address details fields */}
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Endereço de Entrega</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Street */}
                <div className="flex flex-col md:col-span-2 gap-1.5">
                  <label className="text-xs font-bold text-zinc-500">Rua / Logradouro</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    placeholder="Ex: Avenida Paulista"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                {/* Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500">Número</label>
                  <input
                    type="text"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    required
                    placeholder="Ex: 123"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white font-mono focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                {/* Neighborhood */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-500">Bairro</label>
                  <input
                    type="text"
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    required
                    placeholder="Ex: Bela Vista"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                {/* Complement */}
                <div className="flex flex-col md:col-span-2 gap-1.5">
                  <label className="text-xs font-bold text-zinc-500 flex items-center justify-between">
                    Complemento
                    <span className="text-[10px] font-normal lowercase dark:text-zinc-500">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    placeholder="Apto 45, Bloco B"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
             {/* STEP 2: PAYMENT METHOD DEETS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-800 pb-2">2. Forma de Pagamento</h3>
              
              {/* Payment grids buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs tracking-wide transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    paymentMethod === 'pix'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  <Landmark className="w-5.5 h-5.5 text-amber-500" />
                  Pix (Pagar pelo WhatsApp)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs tracking-wide transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    paymentMethod === 'credit'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  <CreditCard className="w-5.5 h-5.5 text-amber-500" />
                  Cartão (Crédito ou Débito na Entrega)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs tracking-wide transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                      : 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  <Coins className="w-5.5 h-5.5 text-amber-500" />
                  Dinheiro físico
                </button>
              </div>
            </div>

            {/* Sub-form fields based on Payment method selection */}
            {paymentMethod === 'pix' && (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3 animate-in zoom-in-95 duration-150">
                <div className="flex gap-2.5">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Como pagar via Pix</h4>
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 leading-relaxed">
                      Ao finalizar o pedido, geraremos um resumo completo para você enviar diretamente para o nosso atendimento pelo WhatsApp. Nossa chave Pix será enviada na sequência para você concluir o pagamento de forma rápida e segura!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'credit' && (
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800 space-y-3 animate-in slide-in-from-top-4 duration-200">
                <div className="flex gap-2.5">
                  <CreditCard className="w-5.5 h-5.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Pagar na Entrega</h4>
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 leading-relaxed">
                      O entregador levará a maquininha física de cartão de crédito e débito até o seu endereço. Aceitamos todas as principais bandeiras (Visa, Mastercard, Elo, Amex, Hipercard).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-158 dark:border-zinc-800 space-y-4 animate-in slide-in-from-top-4 duration-200">
                <div>
                  <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block mb-2">Precisa de Troco para o Entregador?</label>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setNeedsChange(true);
                        setChangeForValue(Math.ceil(total).toString());
                      }}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                        needsChange === true
                          ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600'
                      }`}
                    >
                      Sim, Preciso
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNeedsChange(false);
                        setChangeForValue('');
                      }}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                        needsChange === false
                          ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600'
                      }`}
                    >
                      Não Preciso (Traga o valor exato)
                    </button>
                  </div>
                </div>

                {needsChange && (
                  <div className="flex flex-col gap-1.5 animate-in zoom-in-95 duration-150 max-w-[200px]">
                    <label className="text-xs font-bold text-zinc-500">Troco para quanto?</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs font-bold text-zinc-400">R$</span>
                      <input
                        type="text"
                        value={changeForValue}
                        onChange={(e) => setChangeForValue(e.target.value)}
                        placeholder="100,00"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 pl-8 pr-4 py-2.5 rounded-xl text-sm font-mono text-zinc-905 dark:text-white focus:border-amber-500 outline-none transition-colors"
                      />
                    </div>
                    {parseFloat(changeForValue.replace(',', '.')) <= total && (
                      <span className="text-[10px] text-red-500 font-medium">O valor deve ser maior do que o total (R$ {total.toFixed(2)})</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ORDER TOTAL DEETS SUMMARY REVIEW */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-4 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-800 pb-2">Revisão do Pedido</h3>
              
              {/* Client & Shipping brief metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Informações do Cliente</span>
                  <p className="text-sm font-extrabold text-zinc-805 dark:text-zinc-200">{customer.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{customer.phone}</p>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-105 dark:border-zinc-800/80 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Forma de Envio</span>
                  <p className="text-sm font-extrabold text-zinc-850 dark:text-zinc-200 font-black text-amber-600 dark:text-amber-400">
                    🚗 Entrega por Komy Delivery
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5" title={`${address.street}, ${address.number} - ${address.neighborhood}`}>
                    {address.street}, {address.number} {address.complement && `(${address.complement})`} - {address.neighborhood}
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-105 dark:border-zinc-800/80 rounded-2xl md:col-span-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Método de Pagamento Escolhido</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-205 capitalize">
                      {paymentMethod === 'pix' ? 'Pix pelo WhatsApp' : paymentMethod === 'credit' ? 'Cartão (Crédito ou Débito na entrega)' : 'Dinheiro físico'}
                    </span>
                    {paymentMethod === 'cash' && needsChange && (
                      <span className="text-xs text-zinc-500">• Troco para R$ {parseFloat(changeForValue.replace(',', '.')).toFixed(2).replace('.', ',')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items display reviews list */}
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">Resumo dos Itens ({cart.reduce((s,i)=>s+i.quantity,0)}x)</span>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center text-xs p-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                    <div className="min-w-0 pr-4">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.quantity}x {item.product.name}</span>
                      {item.customizationSummary && (
                        <p className="text-[10.5px] text-amber-600/90 truncate block mt-0.5 italic">{item.customizationSummary}</p>
                      )}
                    </div>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                      R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button Footer section inside card */}
        <div className="mt-8 pt-4 border-t border-zinc-150 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Dynamic values summary */}
          <div className="text-left">
            <span className="text-[11px] text-zinc-400 block pb-0.5">Total a ser pago</span>
            <span className="text-xl font-mono text-amber-600 dark:text-amber-400 font-black">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Stepper dispatch CTAs */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 text-zinc-700 px-5 h-12 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Voltar
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 px-6 h-12 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                Prosseguir
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 h-12 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />
                Confirmar Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
