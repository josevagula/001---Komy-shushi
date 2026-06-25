/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, Store, Plus, Edit, Trash2, Check, X, ShieldAlert, DollarSign, Package2, Truck, ToggleLeft, ToggleRight, Loader2, RefreshCw } from 'lucide-react';
import { Product, RestaurantConfig, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  onUpdateProducts,
  config,
  onUpdateConfig,
  orders,
  onUpdateOrderStatus,
  isOpen,
  onClose
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config'>('orders');

  // Products tab helpers State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    promoPrice: undefined,
    categories: [],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop&q=80',
    rating: 5.0,
    prepTime: '20-25 min',
    isBestSeller: false,
    ingredients: [],
    availableToppings: []
  });

  if (!isOpen) return null;

  // PRODUCT OPERATIONS
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      // Edit existing product
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as Product : p);
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      // Create new one
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        description: productForm.description || '',
        price: Number(productForm.price),
        promoPrice: productForm.promoPrice ? Number(productForm.promoPrice) : undefined,
        categories: productForm.categories || [],
        image: productForm.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop&q=80',
        rating: 5.0,
        prepTime: productForm.prepTime || '20 min',
        isBestSeller: !!productForm.isBestSeller,
        ingredients: productForm.ingredients || ["Pão", "Carne"],
        availableToppings: productForm.availableToppings || []
      };
      onUpdateProducts([...products, newProduct]);
      setIsAddingProduct(false);
    }

    // Reset Form
    setProductForm({
      name: '',
      description: '',
      price: 0,
      promoPrice: undefined,
      categories: [],
      image: '',
      rating: 5.0,
      prepTime: '20 min',
      isBestSeller: false,
      ingredients: [],
      availableToppings: []
    });
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      onUpdateProducts(products.filter(p => p.id !== prodId));
    }
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm(prod);
    setIsAddingProduct(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="admin-panel-container"
        className="bg-zinc-900 rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-zinc-800 animate-in fade-in duration-150"
      >
        {/* Header Admin */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-widest flex items-center gap-1.5 pt-0.5">
                PAINEL OPERACIONAL ADM
                <span className="bg-amber-500/10 text-amber-550 border border-amber-500/20 rounded font-mono text-[9px] px-1 py-0.2 tracking-normal uppercase">Master</span>
              </h3>
              <p className="text-[10.5px] text-zinc-400">Controle de Estoque, Pedidos e Delivery em Tempo Real</p>
            </div>
          </div>
          
          <button 
            id="close-admin"
            onClick={onClose} 
            className="p-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer h-9 flex items-center justify-center"
          >
            Fechar Painel
          </button>
        </div>

        {/* Tab selector buttons */}
        <div className="flex border-b border-zinc-800 shrink-0 bg-zinc-950 px-3 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 font-bold text-xs tracking-wider uppercase transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Package2 className="w-4.5 h-4.5" />
            Pedidos Recebidos ({orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 font-bold text-xs tracking-wider uppercase transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Store className="w-4.5 h-4.5" />
            Produtos & Preços ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3.5 px-4 font-bold text-xs tracking-wider uppercase transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'config'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Truck className="w-4.5 h-4.5" />
            Definições Loja
          </button>
        </div>

        {/* Dynamic Inner Tab View */}
        <div className="flex-1 overflow-y-auto p-5 dark:bg-zinc-950">
          
          {/* TAB 1: ORDER LOGS WITH QUICK STATUS UPDATES */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Registro Sequencial de Pedidos</span>
                <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Atualização Inteligente Ativa
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3.5 text-zinc-400">
                  <Package2 className="w-12 h-12 mx-auto stroke-zinc-400" />
                  <p className="text-sm">Nenhum pedido efetuado nesta sessão.</p>
                </div>
              ) : (
                <div className="space-y-4.5">
                  {[...orders].reverse().map((order) => (
                    <div 
                      key={order.id} 
                      className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-1 bg-zinc-850 p-3 rounded-xl min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-600">#{order.orderNumber}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-105 text-blue-800 dark:bg-blue-950/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1 truncate">{order.customer.name}</h4>
                        <p className="text-[11px] text-zinc-400">{order.customer.phone} • {order.items.reduce((s,i)=>s+i.quantity,0)}x pratos</p>
                      </div>

                      {/* Items lists */}
                      <div className="flex-1 text-xs text-zinc-600 dark:text-zinc-400/90 max-w-[400px]">
                        <span className="font-bold block text-[10px] text-zinc-400 uppercase tracking-wide mb-1">Itens Adquiridos</span>
                        <div className="space-y-1">
                          {order.items.map((it)=>(
                            <div key={it.cartId} className="flex justify-between font-mono">
                              <span className="truncate pr-3">{it.quantity}x {it.product.name}</span>
                              <span className="shrink-0">R$ {it.totalPrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-2 flex justify-between font-bold text-white font-mono">
                          <span>Total Geral do Cliente:</span>
                          <span className="text-amber-600 dark:text-amber-400">R$ {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Control states flow */}
                      <div className="space-y-2 text-right">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Fluxo da Cozinha</span>
                        <div className="flex flex-wrap md:flex-col gap-2">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${order.status === 'preparing' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                            >
                              Preparar
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${order.status === 'shipped' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}
                            >
                              Em Rota
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                            >
                              Entregue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT & CATEGORIES INVENTORY CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Gerenciamento de Cardápio Ativo</span>
                {!isAddingProduct && !editingProduct && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Produto
                  </button>
                )}
              </div>

              {/* Add form overlay / accordion inline */}
              {(isAddingProduct || editingProduct) && (
                <form onSubmit={handleSaveProduct} className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-200">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
                    {editingProduct ? `Editar: ${editingProduct.name}` : 'Criar Novo Prato'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Nome do Item</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Categorias (marque uma ou mais)</label>
                      <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs">
                        {['Destaques', 'Entradas', 'Hots', 'Salmão', 'Temaki', 'Sushis', 'Combos', 'Pokes', 'Especiais', 'Bebidas'].map(cat => {
                          const checked = (productForm.categories || []).includes(cat);
                          return (
                            <label key={cat} className="flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const current = productForm.categories || [];
                                  const next = checked
                                    ? current.filter(c => c !== cat)
                                    : [...current, cat];
                                  setProductForm({ ...productForm, categories: next });
                                }}
                                className="accent-amber-500"
                              />
                              {cat}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Tempo de Preparo Físico</label>
                      <input
                        type="text"
                        value={productForm.prepTime}
                        onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })}
                        placeholder="Ex: 15-20 min"
                        className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Preço Principal (Base)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        placeholder="42.00"
                        className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">Preço Promocional (Opcional)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.promoPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, promoPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="38.90"
                        className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-zinc-500">URL Imagem Gastronômica</label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="bg-zinc-900 border border-zinc-200 px-3 py-2 rounded-xl text-xs dark:border-zinc-805 text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-3">
                      <label className="text-xs font-bold text-zinc-500">Descrição do Produto (Ingredientes em texto)</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="bg-zinc-800 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
                    >
                      {editingProduct ? 'Salvar Edição' : 'Publicar no Cardápio'}
                    </button>
                  </div>
                </form>
              )}

              {/* Items Inventory visual lists block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-xl object-cover shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] bg-zinc-800 text-zinc-500 font-bold px-2 py-0.5 rounded mr-1.5">{item.categories?.join(', ') || 'Sem categoria'}</span>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 inline">{item.name}</h4>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">
                          {item.promoPrice ? (
                            <>
                              <span className="line-through text-zinc-400 mr-1.5">R$ {item.price.toFixed(2)}</span>
                              <strong className="text-emerald-600 font-bold">R$ {item.promoPrice.toFixed(2)}</strong>
                            </>
                          ) : (
                            <strong className="font-bold">R$ {item.price.toFixed(2)}</strong>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProductClick(item)}
                        className="bg-zinc-800 text-zinc-300 p-2 rounded-lg"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="bg-zinc-800 hover:bg-red-500 hover:text-white p-2 rounded-lg text-red-500"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STORE DEFINITIONS */}
          {activeTab === 'config' && (
            <form onSubmit={(e) => { e.preventDefault(); alert('Definições operacionais mantidas!'); }} className="space-y-6">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block border-b border-zinc-100 dark:border-zinc-800 pb-2">Parâmetros Operacionais Loja</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store status Open closed toggles */}
                <div className="p-4 bg-zinc-850 border border-zinc-150 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Disponibilidade Restaurante</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Dita se o cardápio aceita pedidos ou se exibe aviso de "FECHADO".</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, isOpen: !config.isOpen })}
                    className="cursor-pointer text-zinc-700 hover:text-amber-500 transition-colors"
                  >
                    {config.isOpen ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm select-none">
                        <span>ABERTO</span>
                        <ToggleRight className="w-10 h-10" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-500 font-bold text-sm select-none">
                        <span>FECHADO</span>
                        <ToggleLeft className="w-10 h-10" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Delivery Fee settings slider/fields */}
                <div className="p-4 bg-zinc-850 border border-zinc-150 dark:border-zinc-800 rounded-2xl space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Taxa do Delivery</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Taxa de envio física cobrada por pedido padrão.</p>
                  </div>

                  <div className="relative max-w-[160px]">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-zinc-400 font-mono">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={config.deliveryFee}
                      onChange={(e) => onUpdateConfig({ ...config, deliveryFee: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Free shipping boundary thresholds */}
                <div className="p-4 bg-zinc-850 border border-zinc-152 dark:border-zinc-800 rounded-2xl space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Gatilho de Frete Grátis</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">O cliente ganha frete ao ultrapassar este valor.</p>
                  </div>

                  <div className="relative max-w-[160px]">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-zinc-400 font-mono">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={config.freeShippingThresh || ''}
                      onChange={(e) => onUpdateConfig({ ...config, freeShippingThresh: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Minimun order constraints values */}
                <div className="p-4 bg-zinc-850 border border-zinc-152 dark:border-zinc-800 rounded-2xl space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Pedido Mínimo Ativo</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">O checkout se bloqueia caso o carrinho tenha menos do que isso.</p>
                  </div>

                  <div className="relative max-w-[160px]">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-zinc-400 font-mono">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={config.minOrder}
                      onChange={(e) => onUpdateConfig({ ...config, minOrder: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
