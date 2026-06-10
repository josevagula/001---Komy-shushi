/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, UtensilsCrossed, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'chef';
  text: string;
  time: string;
}

interface AISommelierProps {
  products: Product[];
  onAddProductDirectly?: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AISommelier({ products, onAddProductDirectly, isOpen, onClose }: AISommelierProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'chef',
      text: 'Olá! Sou o Chef virtual do Komy Shusi. 👨‍🍳✨ Estou aqui para sugerir as melhores combinações, explicar nossos ingredientes fresh, indicar harmonizações de bebidas ou ajudar você a montar o seu pedido perfeito. O que está com vontade de saborear hoje?',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "🔥 Qual o hambúrguer mais vendido?",
    "🍕 Sugira uma pizza leve e saborosa",
    "🍣 Tem combinados de sushi premium?",
    "🍫 Qual sobremesa você recomenda?",
    "🌱 Opções vegetarianas da casa",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setErrorVisible(false);

    try {
      const response = await fetch('/api/chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentMenu: products,
          previousMessages: messages.slice(-6) // Send recent context
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      
      const chefMessage: Message = {
        id: `chef-${Date.now()}`,
        sender: 'chef',
        text: data.text,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, chefMessage]);
    } catch (error) {
      console.error("Chef assistant request failed:", error);
      setErrorVisible(true);
      
      // Fallback message
      const fallbackMsg: Message = {
        id: `chef-err-${Date.now()}`,
        sender: 'chef',
        text: 'Desculpe, a nossa cozinha virtual está super movimentada agora! Se preferir, você pode explorar nosso cardápio usando as abas de categorias. Recomendo fortemente nosso **Cheddar Bacon Monster** ou a maravilhosa **Pizza Marguerita Suprema**!',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageText = (text: string) => {
    // Basic bold markdown parser (for **text** and *text*) to display nice typography
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const pureText = part.slice(2, -2);
        
        // Check if there is an exact product link we could matches
        const matchedProduct = products.find(p => 
          pureText.toLowerCase() === p.name.toLowerCase() ||
          p.name.toLowerCase().includes(pureText.toLowerCase()) && pureText.length > 5
        );

        if (matchedProduct && onAddProductDirectly) {
          return (
            <span key={index} className="font-bold text-amber-500 hover:underline cursor-pointer group inline-flex items-center gap-1" onClick={() => onAddProductDirectly(matchedProduct)}>
              {pureText}
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 inline" />
            </span>
          );
        }

        return <strong key={index} className="font-bold text-amber-500 dark:text-amber-400">{pureText}</strong>;
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-[#0F0F0F] border-l border-zinc-200 dark:border-white/10 shadow-2xl z-50 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 bg-zinc-900 dark:bg-[#0A0A0A] text-white flex items-center justify-between border-b dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg animate-pulse">
            <Bot className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5 pt-0.5">
              CHEF INTELIGENTE
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </h3>
            <p className="text-xs text-zinc-400">Sommelier & Consultor Gourmet</p>
          </div>
        </div>
        <button id="close-ai" onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-[#0A0A0A]">
        <div className="p-3.5 bg-amber-50 dark:bg-[#0F0F0F] border border-amber-200/50 dark:border-white/5 rounded-xl flex gap-3 text-xs text-amber-800 dark:text-amber-300">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-semibold block mb-0.5">Sugestão Interativa!</span>
            Clique nos nomes dos pratos destacados em dourado no chat para abrir e customizá-los diretamente!
          </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm ${
              msg.sender === 'user'
                ? 'bg-amber-500 text-zinc-900 rounded-tr-none font-medium'
                : 'bg-white dark:bg-[#121212] text-zinc-850 dark:text-zinc-200 border border-zinc-100 dark:border-white/5 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-line leading-relaxed">
                {msg.sender === 'chef' ? parseMessageText(msg.text) : msg.text}
              </div>
              <span className={`block text-[10px] mt-1.5 text-right ${
                msg.sender === 'user' ? 'text-zinc-800' : 'text-zinc-400'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#121212] border border-zinc-100 dark:border-white/5 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"></span>
              </div>
              <p className="text-xs text-zinc-405 mt-2 animate-pulse font-mono">Chef está digitando e selecionando ingredientes...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion tags for conversion */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-2 bg-zinc-50 dark:bg-[#0A0A0A] border-t border-zinc-200/50 dark:border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-white dark:bg-[#0F0F0F] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-1 shrink-0"
            >
              <UtensilsCrossed className="w-3 h-3 text-amber-500" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Send Input Footer */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="p-4 bg-white dark:bg-[#0F0F0F] border-t border-zinc-200 dark:border-white/5 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pergunte ao Chef (EX: 'O que harmoniza com refrigerante?')"
          className="flex-1 bg-zinc-100 dark:bg-zinc-850 outline-none border border-zinc-200 dark:border-zinc-850 rounded-xl px-4 py-3 text-sm focus:border-amber-500 text-zinc-900 dark:text-white transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-amber-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-zinc-900 h-11 w-11 rounded-xl flex items-center justify-center hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
