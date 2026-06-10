/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the application starts gracefully even if API key is not supplied.
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER")) {
    console.warn("[Warning] GEMINI_API_KEY is not defined or is placeholder. AI chef assistant will run in mock mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI Gastronomic AI Consultant
  app.post('/api/chef', async (req, res) => {
    const { prompt, currentMenu, previousMessages } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Faltando o prompt de mensagem do cliente.' });
    }

    try {
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback simulated intelligent response
        let textResponse = "Olá! Sou o Chef Assistente da casa no Komy Shusi. No momento estou finalizando o preparo de alguns pratos na cozinha física (chave da API não configurada), mas com certeza adoraria sugerir o nosso **Hot Roll Nobre (10 unidades)** ou qualquer um de nossos divinos **Temakis Grelhados**! Se preferir, nosso **Combo Samurai (32 Peças)** está com uma oferta fantástica! Qual desses faz mais seu estilo hoje?";
        
        const q = prompt.toLowerCase();
        if (q.includes("combo") || q.includes("casal") || q.includes("família")) {
          textResponse = "Para quem busca custo-benefício e sabor em dobro, nosso **Combo Samurai (32 Peças)** é imbatível! De R$ 139,90 por apenas **R$ 119,90**! Uma grande economia de peças frescas. Quer adicionar ao carrinho?";
        } else if (q.includes("sushi") || q.includes("japa") || q.includes("peixe") || q.includes("combinado")) {
          textResponse = "Excelente escolha de culinária japonesa! Nosso campeão de pedidos é o **Hot Roll Cream Cheese (10 unidades)** por apenas **R$ 28,00**. Se estiver em grupo, o **Combo Samurai Sushi Core (32 peças)** por **R$ 119,90** oferece sashimis maçaricados fresquíssimos, hot rolls super crocantes e uramakis que derretem na boca. Que tal provar hoje?";
        } else if (q.includes("pizza") || q.includes("massa")) {
          textResponse = "Trabalhamos com farinha italiana especial e fermentação natural de 48h! A nossa **Marguerita Suprema (R$ 68,00)** leva queijo de búfala, parmesão ralado na hora e azeite trufado. Já a **Diávolo Pepperoni (R$ 65,00)** é perfeita para quem adora um sabor marcante e leve picância! Gostaria de acrescentar borda recheada com catupiry original?";
        } else if (q.includes("doce") || q.includes("sobremesa") || q.includes("banoffee") || q.includes("petit")) {
          textResponse = "Deixe um espaço para o final feliz! O nosso **Petit Gateau de Chocolate Belga (R$ 29,90)** escorre aquela calda quente dos deuses e acompanha sorvete artesanal de creme da marca. Mas se você gosta de algo menos doce, a **Banoffee Clássica (R$ 22,00 a fatia)** com bananas frescas e chantilly leve é um verdadeiro espetáculo da confeitaria.";
        } else if (q.includes("bebida") || q.includes("refrigerante") || q.includes("cerveja") || q.includes("suco")) {
          textResponse = "Para acompanhar, temos desde a clássica lata de **Coca-Cola trincando (R$ 6,50)** até o nosso refrescante **Suco de Amora com Limão Natural (R$ 13,90)** batido na hora. E para brindar, uma **Heineken gelada Long Neck** por R$ 11,00 é a pedida perfeita!";
        } else if (q.includes("vegetariano") || q.includes("vegano") || q.includes("carne")) {
          textResponse = "Com certeza! Para os amantes de uma excelente opção vegetariana, criamos o **Veggie Trufado (R$ 39,00)**: um blend macio de grão-de-bico com rúcula baby, tomates secos artesanais e uma maionese trufada espetacular no pão australiano. É um dos preferidos inclusive de não-vegetarianos!";
        }
        
        return res.json({ text: textResponse });
      }

      // Convert previous message list if present
      const history = (previousMessages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Create model instructions embedding the dynamic menu
      const menuString = JSON.stringify(currentMenu || []);
      const systemInstruction = `Você é o Chef Sommelier e mestre-cuca virtual do 'Komy Shusi', um maravilhoso e tradicional restaurante de sushi delivery.
Seu papel é responder com simpatia, elegância e entusiasmo culinário.
Use o cardápio oficial a seguir para suas recomendações detalhadas:

CARDÁPIO DISPONÍVEL DO RESTAURANTE:
${menuString}

DIRETRIZES DE COMPORTAMENTO:
1. Responda SEMPRE em Português do Brasil (pt-BR).
2. Escreva respostas de no máximo 2 a 3 parágrafos, sedutoras e que despertem o apetite! Use termos gastronômicos sofisticados.
3. SEMPRE cite os preços corretos dos produtos mostrados no cardápio de forma clara (exemplo: "R$ 38,90").
4. Faça sugestões inteligentes de Upselling (por exemplo, sugerir um refrigerante ou itens adicionais).
5. Se o cliente perguntar o que comer, induza-o com base nos nossos sushis mais vendidos.
6. NUNCA invente itens que não estejam na lista do cardápio enviada acima, a menos que seja para sugerir uma variação de ingrediente comum (ex: salada, queijo extra).`;

      // Formulate the prompt sequence including system instruction
      const contents = [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });

      const generatedText = response.text || "Hum, desculpe, meus pensamentos na cozinha se misturaram! O que posso preparar para você hoje?";
      return res.json({ text: generatedText });

    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({ error: "Erro ao processar sua recomendação com o Chef. Detalhes: " + err.message });
    }
  });

  // Serve static assets in production, otherwise mount Vite in development
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on status: open at port ${PORT}`);
  });
}

startServer();
