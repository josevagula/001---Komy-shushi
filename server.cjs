var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER")) {
    console.warn("[Warning] GEMINI_API_KEY is not defined or is placeholder. AI chef assistant will run in mock mode.");
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/chef", async (req, res) => {
    const { prompt, currentMenu, previousMessages } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Faltando o prompt de mensagem do cliente." });
    }
    try {
      const ai = getGeminiClient();
      if (!ai) {
        let textResponse = "Ol\xE1! Sou o Chef Assistente da casa no Komy Sushi. No momento estou finalizando o preparo de alguns pratos na cozinha f\xEDsica (chave da API n\xE3o configurada), mas com certeza adoraria sugerir o nosso **Hot Roll Premium (8 unidades)** ou qualquer um de nossos divinos **Temakis**! Se preferir, nosso **Combinado 1 (35 pe\xE7as)** est\xE1 com uma oferta fant\xE1stica! Qual desses faz mais seu estilo hoje?";
        const q = prompt.toLowerCase();
        if (q.includes("combo") || q.includes("combinado") || q.includes("fam\xEDlia")) {
          textResponse = "Para quem busca custo-benef\xEDcio e sabor em dobro, nosso **Combinado 1 (35 Pe\xE7as)** \xE9 imbat\xEDvel por apenas **R$ 76,99**! Uma grande sele\xE7\xE3o de pe\xE7as frescas. Quer adicionar ao carrinho?";
        } else if (q.includes("sushi") || q.includes("japa") || q.includes("peixe") || q.includes("hot")) {
          textResponse = "Excelente escolha de culin\xE1ria japonesa! Nosso campe\xE3o de pedidos \xE9 o **Hot Roll Premium (8 unidades)** por apenas **R$ 36,99**. Se estiver em grupo, o **Combinado 2 (35 pe\xE7as)** por **R$ 79,99** oferece sashimis fresqu\xEDssimos, hot rolls super crocantes e uramakis que derretem na boca. Que tal provar hoje?";
        } else if (q.includes("poke") || q.includes("bowl")) {
          textResponse = "Nossos Pokes s\xE3o sensacionais! O **Poke Salm\xE3o Grelhado (R$ 47,99)** e o **Poke Salm\xE3o em Cubos (R$ 44,99)** s\xE3o os mais pedidos. Ambos vem com arroz, cream cheese, sunomono, couve crispy e muito mais!";
        } else if (q.includes("doce") || q.includes("sobremesa") || q.includes("ichigo")) {
          textResponse = "Deixe um espa\xE7o para o final feliz! O nosso **Ichigo (8 unidades - R$ 33,99)** \xE9 uma sobremesa incr\xEDvel com goiabada, cream cheese, morango e leite condensado. Perfeito para ado\xE7ar seu pedido!";
        } else if (q.includes("bebida") || q.includes("refrigerante") || q.includes("suco")) {
          textResponse = "Para acompanhar, temos desde a cl\xE1ssica **Coca-Cola gelada (R$ 6,00)** at\xE9 o nosso refrescante **Suco Summer Orange (R$ 10,00)** natural. A combina\xE7\xE3o perfeita para seu sushi!";
        } else if (q.includes("burger") || q.includes("komy")) {
          textResponse = "O **Burger Komy** \xE9 uma experi\xEAncia \xFAnica! Arroz prensado com salm\xE3o grelhado (R$ 46,99) ou em cubos (R$ 41,99), ambos com cream cheese, cebola roxa e mussarela. Simplesmente imperd\xEDvel!";
        }
        return res.json({ text: textResponse });
      }
      const history = (previousMessages || []).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      const menuString = JSON.stringify(currentMenu || []);
      const systemInstruction = `Voc\xEA \xE9 o Chef Sommelier e mestre-cuca virtual do 'Komy Sushi', um maravilhoso e tradicional restaurante de sushi delivery.
Seu papel \xE9 responder com simpatia, eleg\xE2ncia e entusiasmo culin\xE1rio.
Use o card\xE1pio oficial a seguir para suas recomenda\xE7\xF5es detalhadas:

CARD\xC1PIO DISPON\xCDVEL DO RESTAURANTE:
${menuString}

DIRETRIZES DE COMPORTAMENTO:
1. Responda SEMPRE em Portugu\xEAs do Brasil (pt-BR).
2. Escreva respostas de no m\xE1ximo 2 a 3 par\xE1grafos, sedutoras e que despertem o apetite! Use termos gastron\xF4micos sofisticados.
3. SEMPRE cite os pre\xE7os corretos dos produtos mostrados no card\xE1pio de forma clara (exemplo: "R$ 38,90").
4. Fa\xE7a sugest\xF5es inteligentes de Upselling (por exemplo, sugerir um refrigerante ou itens adicionais).
5. Se o cliente perguntar o que comer, induza-o com base nos nossos sushis mais vendidos.
6. NUNCA invente itens que n\xE3o estejam na lista do card\xE1pio enviada acima, a menos que seja para sugerir uma varia\xE7\xE3o de ingrediente comum (ex: salada, queijo extra).`;
      const contents = [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ];
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });
      const generatedText = response.text || "Hum, desculpe, meus pensamentos na cozinha se misturaram! O que posso preparar para voc\xEA hoje?";
      return res.json({ text: generatedText });
    } catch (err) {
      console.error("Gemini API error:", err);
      return res.status(500).json({ error: "Erro ao processar sua recomenda\xE7\xE3o com o Chef. Detalhes: " + err.message });
    }
  });
  if (process.env.NODE_ENV === "production") {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  } else {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on status: open at port ${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
