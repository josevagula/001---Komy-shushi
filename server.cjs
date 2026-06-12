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
        let textResponse = "Ol\xE1! Sou o Chef Assistente da casa no Komy Shusi. No momento estou finalizando o preparo de alguns pratos na cozinha f\xEDsica (chave da API n\xE3o configurada), mas com certeza adoraria sugerir o nosso **Hot Roll Nobre (10 unidades)** ou qualquer um de nossos divinos **Temakis Grelhados**! Se preferir, nosso **Combo Samurai (32 Pe\xE7as)** est\xE1 com uma oferta fant\xE1stica! Qual desses faz mais seu estilo hoje?";
        const q = prompt.toLowerCase();
        if (q.includes("combo") || q.includes("casal") || q.includes("fam\xEDlia")) {
          textResponse = "Para quem busca custo-benef\xEDcio e sabor em dobro, nosso **Combo Samurai (32 Pe\xE7as)** \xE9 imbat\xEDvel! De R$ 139,90 por apenas **R$ 119,90**! Uma grande economia de pe\xE7as frescas. Quer adicionar ao carrinho?";
        } else if (q.includes("sushi") || q.includes("japa") || q.includes("peixe") || q.includes("combinado")) {
          textResponse = "Excelente escolha de culin\xE1ria japonesa! Nosso campe\xE3o de pedidos \xE9 o **Hot Roll Cream Cheese (10 unidades)** por apenas **R$ 28,00**. Se estiver em grupo, o **Combo Samurai Sushi Core (32 pe\xE7as)** por **R$ 119,90** oferece sashimis ma\xE7aricados fresqu\xEDssimos, hot rolls super crocantes e uramakis que derretem na boca. Que tal provar hoje?";
        } else if (q.includes("pizza") || q.includes("massa")) {
          textResponse = "Trabalhamos com farinha italiana especial e fermenta\xE7\xE3o natural de 48h! A nossa **Marguerita Suprema (R$ 68,00)** leva queijo de b\xFAfala, parmes\xE3o ralado na hora e azeite trufado. J\xE1 a **Di\xE1volo Pepperoni (R$ 65,00)** \xE9 perfeita para quem adora um sabor marcante e leve pic\xE2ncia! Gostaria de acrescentar borda recheada com catupiry original?";
        } else if (q.includes("doce") || q.includes("sobremesa") || q.includes("banoffee") || q.includes("petit")) {
          textResponse = "Deixe um espa\xE7o para o final feliz! O nosso **Petit Gateau de Chocolate Belga (R$ 29,90)** escorre aquela calda quente dos deuses e acompanha sorvete artesanal de creme da marca. Mas se voc\xEA gosta de algo menos doce, a **Banoffee Cl\xE1ssica (R$ 22,00 a fatia)** com bananas frescas e chantilly leve \xE9 um verdadeiro espet\xE1culo da confeitaria.";
        } else if (q.includes("bebida") || q.includes("refrigerante") || q.includes("cerveja") || q.includes("suco")) {
          textResponse = "Para acompanhar, temos desde a cl\xE1ssica lata de **Coca-Cola trincando (R$ 6,50)** at\xE9 o nosso refrescante **Suco de Amora com Lim\xE3o Natural (R$ 13,90)** batido na hora. E para brindar, uma **Heineken gelada Long Neck** por R$ 11,00 \xE9 a pedida perfeita!";
        } else if (q.includes("vegetariano") || q.includes("vegano") || q.includes("carne")) {
          textResponse = "Com certeza! Para os amantes de uma excelente op\xE7\xE3o vegetariana, criamos o **Veggie Trufado (R$ 39,00)**: um blend macio de gr\xE3o-de-bico com r\xFAcula baby, tomates secos artesanais e uma maionese trufada espetacular no p\xE3o australiano. \xC9 um dos preferidos inclusive de n\xE3o-vegetarianos!";
        }
        return res.json({ text: textResponse });
      }
      const history = (previousMessages || []).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      const menuString = JSON.stringify(currentMenu || []);
      const systemInstruction = `Voc\xEA \xE9 o Chef Sommelier e mestre-cuca virtual do 'Komy Shusi', um maravilhoso e tradicional restaurante de sushi delivery.
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
