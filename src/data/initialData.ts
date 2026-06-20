/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, RestaurantConfig, Coupon } from '../types';

export const initialRestaurantConfig: RestaurantConfig = {
  name: "KOMY SUSHI",
  logo: "/images/logo.jpeg",
  banner: "/images/sushi_banner_premium_dark_1781131159755.png",
  description: "Sabor autêntico e frescor incomparável. Sushis e combinados premium preparados com maestria para a melhor experiência na sua casa.",
  rating: 5.0,
  reviewsCount: 320,
  deliveryTime: "45-60 min",
  minOrder: 30.00,
  deliveryFee: 0.00,
  freeShippingThresh: 0,
  isOpen: true,
  whatsappNumber: "554396787495"
};

// Standard toppings available across various products
const standardSushiToppings = [
  { name: "Cream Cheese Extra", price: 4.50, max: 1 },
  { name: "Cebolinha Extra", price: 1.50, max: 1 },
  { name: "Gergelim Extra", price: 1.00, max: 1 }
];

export const initialProducts: Product[] = [
  // --- Destaques & Hots ---
  {
    id: "hot-1",
    name: "Hot Roll (8 unidades)",
    description: "Arroz, nori, salmão, cream cheese, cebolinha verde e molho tarê",
    price: 36.99,
    categories: ["Destaques", "Hots"],
    image: "/images/hot_roll.png",
    rating: 5.0,
    prepTime: "20-25 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Nori", "Salmão", "Cream Cheese", "Cebolinha Verde", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "hot-6",
    name: "Hot Temaki (1 unidade)",
    description: "Arroz, nori, salmão, cream cheese, cebolinha verde e molho tarê",
    price: 39.99,
    categories: ["Destaques", "Hots", "Temaki"],
    image: "/images/hot_temaki.png",
    rating: 5.0,
    prepTime: "15-20 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Nori", "Salmão", "Cream Cheese", "Cebolinha Verde", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde", "Molho Tarê"],
      addableIngredients: []
    }
  },

  // --- Entradas ---
  {
    id: "sunomono-1",
    name: "Sunomono",
    description: "Fatia de pepino com molho agridoce e gergelim — 100 gramas",
    price: 19.99,
    categories: ["Entradas"],
    image: "/images/sunomono_real_1781054298241.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Pepino fatiado", "Gergelim torrado", "Molho agridoce agridoce"],
    availableToppings: [{ name: "Gergelim Moído", price: 1.00, max: 1 }],
    customization: { enabled: false }
  },

  // --- Hots ---
  {
    id: "hot-2",
    name: "Hot Roll c/ Pimenta Bico (8 unidades)",
    description: "Arroz, nori, salmão, cream cheese, cebolinha verde, molho tarê & pimenta bico",
    price: 36.99,
    categories: ["Hots"],
    image: "/images/hot_pimenta_bico.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["Arroz", "Nori", "Salmão", "Cream Cheese", "Cebolinha Verde", "Molho Tarê", "Pimenta Bico"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "hot-3",
    name: "Hot Roll Couve Crispy (8 unidades)",
    description: "Arroz, nori, salmão, cream cheese, molho tarê & couve crispy",
    price: 36.99,
    categories: ["Hots"],
    image: "/images/hot_crispy.png",
    rating: 5.0,
    prepTime: "20-25 min",
    isFeatured: true,
    ingredients: ["Arroz", "Nori", "Salmão", "Cream Cheese", "Molho Tarê", "Couve Crispy"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "hot-4",
    name: "Hot Batata Crispy (8 unidades)",
    description: "Arroz, nori, salmão, cream cheese e batata crispy",
    price: 36.99,
    categories: ["Hots"],
    image: "/images/hot_roll_premium_1781053951166.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["Arroz", "Nori", "Salmão", "Cream Cheese", "Batata Crispy"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "hot-5",
    name: "Hot Aberto (1 unidade)",
    description: "Arroz, nori, salmão em cubos, cream cheese, cebolinha verde e molho tarê",
    price: 38.99,
    categories: ["Hots"],
    image: "/images/hot_aberto_real_1781054313711.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Nori", "Salmão em Cubos", "Cream Cheese", "Cebolinha Verde", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde"],
      addableIngredients: []
    }
  },
  {
    id: "hot-7",
    name: "Hot Temaki s/ Arroz (1 unidade)",
    description: "Nori, salmão, cream cheese, cebolinha verde e molho tarê",
    price: 44.99,
    categories: ["Hots", "Temaki"],
    image: "/images/hot_temaki_no_rice_lying_table_1781055147154.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Nori", "Salmão", "Cream Cheese", "Cebolinha Verde", "Molho Tarê"],
    availableToppings: [
      { name: "Cream Cheese Extra", price: 4.50, max: 1 }
    ],
    customization: {
      removableIngredients: ["Cebolinha Verde", "Molho Tarê"],
      addableIngredients: []
    }
  },

  // --- Salmão ---
  {
    id: "sashimi-1",
    name: "Sashimi Salmão Komy (4 peças)",
    description: "Salmão Komy — Lâminas de salmão — 4 peças",
    price: 36.99,
    categories: ["Salmão"],
    image: "/images/sashimi_fresh_slices_real_1781055163411.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Lâminas de Salmão Fresco"],
    availableToppings: [{ name: "Wasabi Extra", price: 2.00, max: 1 }],
    customization: { enabled: false }
  },
  {
    id: "sashimi-2",
    name: "Sashimi Salmão Komy (6 peças)",
    description: "Salmão Komy — Lâminas de salmão — 6 peças",
    price: 41.99,
    categories: ["Salmão"],
    image: "/images/sashimi_fresh_slices_real_1781055163411.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Lâminas de Salmão Fresco"],
    availableToppings: [{ name: "Wasabi Extra", price: 2.00, max: 1 }],
    customization: { enabled: false }
  },
  {
    id: "sashimi-3",
    name: "Sashimi Salmão Komy (8 peças)",
    description: "Salmão Komy — Lâminas de salmão — 8 peças",
    price: 73.99,
    categories: ["Salmão"],
    image: "/images/sashimi_fresh_slices_real_1781055163411.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Lâminas de Salmão Fresco"],
    availableToppings: [{ name: "Wasabi Extra", price: 2.00, max: 1 }],
    customization: { enabled: false }
  },
  {
    id: "sashimi-4",
    name: "Salmão Maçaricado (4 peças)",
    description: "Salmão Maçaricado — Lâminas de salmão — 4 peças",
    price: 38.99,
    categories: ["Salmão"],
    image: "/images/sashimi_seared_slices_real_1781055180278.png",
    rating: 5.0,
    prepTime: "12-18 min",
    ingredients: ["Salmão Maçaricado"],
    availableToppings: [],
    customization: { enabled: false }
  },
  {
    id: "sashimi-5",
    name: "Salmão Maçaricado (6 peças)",
    description: "Salmão Maçaricado — 6 peças",
    price: 44.99,
    categories: ["Salmão"],
    image: "/images/sashimi_seared_slices_real_1781055180278.png",
    rating: 5.0,
    prepTime: "12-18 min",
    ingredients: ["Salmão Maçaricado"],
    availableToppings: [],
    customization: { enabled: false }
  },
  {
    id: "sashimi-6",
    name: "Salmão Maçaricado (8 peças)",
    description: "Salmão Maçaricado — 8 peças",
    price: 77.99,
    categories: ["Salmão"],
    image: "/images/sashimi_seared_slices_real_1781055180278.png",
    rating: 5.0,
    prepTime: "12-18 min",
    ingredients: ["Salmão Maçaricado"],
    availableToppings: [],
    customization: { enabled: false }
  },

  // --- Temaki ---
  {
    id: "temaki-1",
    name: "Temaki c/ Salmão em Cubos",
    description: "Arroz, nori, salmão, gergelim, cebolinha verde e molho tarê",
    price: 33.99,
    categories: ["Temaki"],
    image: "/images/hot_temaki_lying_table_1781055129959.png",
    rating: 5.0,
    prepTime: "10-15 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Nori", "Salmão em Cubos", "Cebolinha Verde", "Gergelim", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde", "Gergelim", "Molho Tarê"],
      addableIngredients: [
        { name: "Cream Cheese", price: 4.50, max: 1 }
      ]
    }
  },
  {
    id: "temaki-2",
    name: "Temaki Salmão s/ Arroz",
    description: "Nori, salmão, gergelim, cebolinha verde & molho tarê",
    price: 39.99,
    categories: ["Temaki"],
    image: "/images/hot_temaki_no_rice_lying_table_1781055147154.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Nori", "Salmão em Cubos", "Cebolinha Verde", "Gergelim", "Molho Tarê"],
    availableToppings: [{ name: "Cream Cheese Extra", price: 4.50, max: 1 }],
    customization: {
      removableIngredients: ["Cebolinha Verde", "Gergelim", "Molho Tarê"],
      addableIngredients: [
        { name: "Cream Cheese", price: 4.50, max: 1 }
      ]
    }
  },
  {
    id: "temaki-3",
    name: "Temaki Skin",
    description: "Arroz, nori, pele de salmão, cream cheese, cebolinha verde & gergelim",
    price: 31.99,
    categories: ["Temaki"],
    image: "/images/hot_temaki_lying_table_1781055129959.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Arroz", "Nori", "Pele de Salmão", "Cream Cheese", "Cebolinha Verde", "Gergelim"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde", "Gergelim", "Molho Tarê"],
      addableIngredients: []
    }
  },

  // --- Sushis ---
  {
    id: "sushi-1",
    name: "Niguiri Salmão (8 unidades)",
    description: "Arroz, fatia de salmão",
    price: 37.99,
    categories: ["Sushis"],
    image: "/images/niguiri_salmao_real_1781055795296.png",
    rating: 5.0,
    prepTime: "12-18 min",
    ingredients: ["Arroz Shari", "Fatias de Salmão"],
    availableToppings: [],
    customization: { enabled: false }
  },
  {
    id: "sushi-2",
    name: "Niguiri Maçaricado (8 unidades)",
    description: "Arroz, fatia de salmão maçaricado",
    price: 39.99,
    categories: ["Sushis"],
    image: "/images/niguiri_macaricado_real_1781055808570.png",
    rating: 5.0,
    prepTime: "12-18 min",
    ingredients: ["Arroz", "Fatias de Salmão Maçaricado"],
    availableToppings: [],
    customization: { enabled: false }
  },
  {
    id: "sushi-3",
    name: "Joy Salmão (8 unidades)",
    description: "Arroz, fatia de salmão, cream cheese, cebolinha verde",
    price: 37.99,
    categories: ["Sushis"],
    image: "/images/niguiri_salmao_real_1781055795296.png",
    rating: 5.0,
    prepTime: "15-20 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Fatia de Salmão", "Cream Cheese", "Cebolinha Verde"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde"],
      addableIngredients: []
    }
  },
  {
    id: "sushi-4",
    name: "Joy Maçaricado (8 unidades)",
    description: "Arroz, fatia de salmão maçaricado, cream cheese, cebolinha verde",
    price: 37.99,
    categories: ["Sushis"],
    image: "/images/joy_macaricado_real_1781055818957.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Fatia de Salmão Maçaricado", "Cream Cheese", "Cebolinha Verde"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: ["Cebolinha Verde"],
      addableIngredients: []
    }
  },
  {
    id: "sushi-5",
    name: "Joy Pimenta Bico (8 unidades)",
    description: "Arroz, fatia de salmão, cream cheese, pimenta bico",
    price: 40.99,
    categories: ["Sushis"],
    image: "/images/joy_macaricado_real_1781055818957.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Fatia de Salmão", "Cream Cheese", "Pimenta Bico"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sushi-6",
    name: "Joy Maçaricado c/ Geléia do Chef (8 unidades)",
    description: "Arroz, fatia de salmão maçaricado, cream cheese, geléia do chef",
    price: 39.99,
    categories: ["Sushis"],
    image: "/images/joy_macaricado_real_1781055818957.png",
    rating: 5.0,
    prepTime: "15-20 min",
    isFeatured: true,
    ingredients: ["Arroz", "Fatia de Salmão Maçaricado", "Cream Cheese", "Geléia do Chef"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sushi-7",
    name: "Uramaki Salmão Grelhado (8 unidades)",
    description: "Arroz, nori, salmão grelhado, cream cheese",
    price: 40.99,
    categories: ["Sushis"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Nori", "Salmão Grelhado", "Cream Cheese", "Gergelim"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sushi-8",
    name: "Uramaki Philadelfia (8 unidades)",
    description: "Arroz, nori, salmão, cream cheese",
    price: 37.99,
    categories: ["Sushis"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "15-20 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Nori", "Salmão Fresco", "Cream Cheese", "Gergelim"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sushi-9",
    name: "Uramaki Skin (8 unidades)",
    description: "Arroz, nori, pele de salmão, cream cheese",
    price: 31.99,
    categories: ["Sushis"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Nori", "Pele de Salmão Grelhada", "Cream Cheese", "Gergelim"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sushi-10",
    name: "Hossomaki Shakemaki (8 unidades)",
    description: "Arroz, nori, salmão — 8 unidades",
    price: 31.99,
    categories: ["Sushis"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Arroz", "Nori", "Salmão"],
    availableToppings: [],
    customization: { enabled: false }
  },

  // --- Combos ---
  {
    id: "combo-1",
    name: "Combo 1 (8 unidades)",
    description: "Combo 1 — 2 Hots, 2 Uramaki, 2 Hossomaki, 2 Joy",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["2 Hots", "2 Uramaki", "2 Hossomaki", "2 Joy"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha"],
      addableIngredients: []
    }
  },
  {
    id: "combo-2",
    name: "Combo 2 (8 unidades)",
    description: "Combo 2 — 2 Hots, 2 Uramaki, 2 Niguiri, 2 Joy",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["2 Hots", "2 Uramaki", "2 Niguiri", "2 Joy"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "combo-3",
    name: "Combo 3 (8 unidades)",
    description: "Combo 3 — 2 Hots, 2 Uramaki, 2 Joy, 2 Ichigo",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/combo_03.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["2 Hots", "2 Uramaki", "2 Joy", "2 Ichigo"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "combo-4",
    name: "Combo 4 (8 unidades)",
    description: "Combo 4 — 4 Hots, 4 Uramaki",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["4 Hots", "4 Uramaki"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "combo-5",
    name: "Combo 5 (8 unidades)",
    description: "Combo 5 — 2 Uramaki, 2 Ichigo, 2 Hot Crispy, 2 Hot Roll",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["2 Uramaki", "2 Ichigo", "2 Hot Crispy", "2 Hot Roll"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "combo-6",
    name: "Combo 6 (8 unidades)",
    description: "Combo 6 — 2 Uramaki, 2 Ichigo, 4 Hot Roll",
    price: 38.99,
    categories: ["Combos"],
    image: "/images/sushi_combo_real_1781055442244.png",
    rating: 5.0,
    prepTime: "20-25 min",
    ingredients: ["2 Uramaki", "2 Ichigo", "4 Hot Roll"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Molho Tarê"],
      addableIngredients: []
    }
  },
  {
    id: "comb-1",
    name: "Combinado 1 (35 peças)",
    description: "8 peças de Hot Tradicional, 8 peças de Geléia do Chef, 8 peças de Hot Crispy Batata, 11 peças de Hot Crispy Couve",
    price: 76.99,
    categories: ["Combos"],
    image: "/images/combinado_01.png",
    rating: 5.0,
    prepTime: "30-40 min",
    isBestSeller: true,
    ingredients: ["Hot Tradicional", "Hot Geléia do Chef", "Hot Crispy Batata", "Hot Crispy Couve"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Crisp de Batata", "Crisp de Couve", "Geléia do Chef"],
      addableIngredients: []
    }
  },
  {
    id: "comb-2",
    name: "Combinado 2 (35 peças)",
    description: "8 peças de Hot Tradicional, 8 peças com Geléia do Chef, 8 peças de Hot Crispy Batata, 7 peças de Uramaki Philadelfia, 4 peças de Hossomaki Shakemaki",
    price: 79.99,
    categories: ["Combos"],
    image: "/images/combinado_02.png",
    rating: 5.0,
    prepTime: "30-40 min",
    ingredients: ["Hot Tradicional", "Hot Geléia do Chef", "Hot Crispy Batata", "Uramaki Philadelfia", "Hossomaki Shakemaki"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Crisp de Batata", "Geléia do Chef"],
      addableIngredients: []
    }
  },
  {
    id: "comb-3",
    name: "Combinado 3 (19 peças)",
    description: "4 peças de Hot Tradicional, 4 peças com Geléia do Chef, 4 peças de Hot Crispy Batata, 4 peças de Hossomaki Shakemaki, 3 peças de Uramaki Philadelfia",
    price: 52.99,
    categories: ["Combos"],
    image: "/images/combinado_03.png",
    rating: 5.0,
    prepTime: "25-30 min",
    ingredients: ["Hot Tradicional", "Hot Geléia do Chef", "Hot Crispy Batata", "Hossomaki Shakemaki", "Uramaki Philadelfia"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Crisp de Batata", "Geléia do Chef"],
      addableIngredients: []
    }
  },
  {
    id: "comb-4",
    name: "Combinado 4 (19 peças)",
    description: "4 peças de Hot Tradicional, 4 peças com Geléia do Chef, 4 peças de Hot Crispy Batata, 4 peças de Hossomaki Shakemaki, 3 Joy",
    price: 52.99,
    categories: ["Combos"],
    image: "/images/combinado_04.png",
    rating: 5.0,
    prepTime: "25-30 min",
    ingredients: ["Hot Tradicional", "Hot Geléia do Chef", "Hot Crispy Batata", "Hossomaki Shakemaki", "Joy Salmão"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Crisp de Batata", "Geléia do Chef"],
      addableIngredients: []
    }
  },
  {
    id: "comb-5",
    name: "Combinado 5 (18 peças)",
    description: "2 peças de Hot Tradicional, 2 peças de Hot Crispy Couve, 2 peças de Hot Pimenta Bico, 2 peças de Hot Crispy Batata, 2 peças de Joy com Geléia do Chef, 4 peças de Uramaki Philadelfia, 4 peças de Hossomaki Shakemaki",
    price: 49.99,
    categories: ["Combos"],
    image: "/images/sushi_combinado_real_1781055460922.png",
    rating: 5.0,
    prepTime: "25-30 min",
    ingredients: ["Hot Tradicional", "Hot Crispy Couve", "Hot Pimenta Bico", "Hot Crispy Batata", "Joy Geléia", "Uramaki Philadelfia", "Hossomaki Shakemaki"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha", "Crisp de Batata", "Crisp de Couve", "Geléia do Chef", "Pimenta Bico"],
      addableIngredients: []
    }
  },

  // --- Pokes ---
  {
    id: "poke-1",
    name: "Poke Salmão Grelhado",
    description: "Arroz, cream cheese, salmão grelhado, sunomono, salada de repolho agridoce, couve crispy, batata doce crispy, tomate cereja, cebola roxa, cebolinha verde, gergelim & molho tarê — aprox. 400g",
    price: 47.99,
    categories: ["Pokes"],
    image: "/images/poke_grelhado.png",
    rating: 5.0,
    prepTime: "15-20 min",
    ingredients: ["Arroz", "Cream Cheese", "Salmão Grelhado", "Sunomono", "Salada de Repolho Agridoce", "Couve Crispy", "Batata Crispy", "Tomate Cereja", "Cebola Roxa", "Cebolinha Verde", "Gergelim", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: [],
      addableIngredients: [
        { name: "Arroz 100g extra", price: 3.00, max: 1 },
        { name: "Cream Cheese extra", price: 2.00, max: 1 },
        { name: "Salmão Grelhado extra", price: 4.00, max: 1 }
      ]
    }
  },
  {
    id: "poke-2",
    name: "Poke Salmão em Cubos",
    description: "Arroz, cream cheese, salmão em cubos, sunomono, salada de repolho agridoce, couve crispy, batata doce crispy, tomate cereja, cebola roxa, cebolinha verde, gergelim & molho tarê — aprox. 400g",
    price: 44.99,
    categories: ["Pokes"],
    image: "/images/poke_em_cubos.png",
    rating: 5.0,
    prepTime: "15-20 min",
    isBestSeller: true,
    ingredients: ["Arroz", "Cream Cheese", "Salmão em Cubos", "Sunomono", "Salada de Repolho Agridoce", "Couve Crispy", "Batata Crispy", "Tomate Cereja", "Cebola Roxa", "Cebolinha Verde", "Gergelim", "Molho Tarê"],
    availableToppings: standardSushiToppings,
    customization: {
      removableIngredients: [],
      addableIngredients: [
        { name: "Arroz 100g extra", price: 3.00, max: 1 },
        { name: "Cream Cheese extra", price: 2.00, max: 1 },
        { name: "Salmão em Cubos extra", price: 4.00, max: 1 }
      ]
    }
  },

  // --- Especiais ---
  {
    id: "barca-1",
    name: "Barca Komy (23 peças)",
    description: "1 BARCA — 23 peças: 4 lâminas, 4 Hot Roll, 4 Uramaki, 2 Niguiri, 2 Joy, 4 Hossomaki, 3 Ichigo",
    price: 84.99,
    categories: ["Especiais"],
    image: "/images/sushi_combinado_real_1781055460922.png",
    rating: 5.0,
    prepTime: "25-35 min",
    isFeatured: true,
    ingredients: ["Sashimi", "Hot Roll", "Uramaki", "Niguiri", "Joy", "Hossomaki", "Ichigo doce"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Cebolinha"],
      addableIngredients: []
    }
  },
  {
    id: "burger-1",
    name: "Burger Komy c/ Salmão Grelhado",
    description: "Arroz prensado, salmão grelhado, cebola roxa, cream cheese, cebolinha verde, mussarela em fatias — aprox. 200 gramas",
    price: 46.99,
    categories: ["Especiais"],
    image: "/images/burger_komy_1781052743744.png",
    rating: 5.0,
    prepTime: "18-25 min",
    isFeatured: true,
    ingredients: ["Arroz Prensado", "Salmão Grelhado", "Cebola Roxa", "Cream Cheese", "Cebolinha Verde", "Mussarela em Fatias"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Mussarela em Fatias", "Cebola Roxa"],
      addableIngredients: []
    }
  },
  {
    id: "burger-2",
    name: "Burger Komy c/ Salmão em Cubos",
    description: "Arroz prensado, salmão em cubos, cebola roxa, cream cheese, cebolinha verde, mussarela em fatias — aprox. 200 gramas",
    price: 41.99,
    categories: ["Especiais"],
    image: "/images/burger_komy_cubos_1781054809469.png",
    rating: 5.0,
    prepTime: "18-25 min",
    ingredients: ["Arroz Prensado", "Salmão em Cubos", "Cebola Roxa", "Cream Cheese", "Cebolinha Verde", "Mussarela em Fatias"],
    availableToppings: [],
    customization: {
      removableIngredients: ["Mussarela em Fatias", "Cebola Roxa"],
      addableIngredients: []
    }
  },
  {
    id: "special-1",
    name: "Pote da Felicidade (1 unidade)",
    description: "Arroz, cream cheese & salmão — aprox. 150 gramas",
    price: 31.99,
    categories: ["Especiais"],
    image: "/images/pote_da_felicidade.png",
    rating: 5.0,
    prepTime: "10-15 min",
    ingredients: ["Arroz Shari", "Cream Cheese", "Salmão fresco em cubos"],
    availableToppings: standardSushiToppings,
    customization: { enabled: false }
  },
  {
    id: "sweet-1",
    name: "Ichigo (8 unidades)",
    description: "Goiabada, cream cheese, morango & leite condensado",
    price: 33.99,
    categories: ["Especiais"],
    image: "/images/ichigo_sweet_1781052762028.png",
    rating: 5.0,
    prepTime: "10-15 min",
    isBestSeller: true,
    ingredients: ["Goiabada", "Cream Cheese", "Morango", "Leite Condensado"],
    availableToppings: [],
    customization: { enabled: false }
  },
  {
    id: "adicional-1",
    name: "Molho Tarê 35ml",
    description: "Molho Tarê 35ml para complementar suas peças",
    price: 6.00,
    categories: ["Especiais"],
    image: "/images/molho_tare.png",
    rating: 5.0,
    prepTime: "1 min",
    ingredients: ["Molho Tarê Especial"],
    availableToppings: [],
    customization: { enabled: false }
  },

  // --- Bebidas ---
  {
    id: "bebida-1",
    name: "Coca-Cola 350ml",
    description: "Refrigerante Coca-Cola em lata original de 350ml bem gelado",
    price: 6.00,
    categories: ["Bebidas"],
    image: "/images/coca_cola_2l_1781053935428.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-2",
    name: "Coca-Cola Lata Zero 350ml",
    description: "Refrigerante Coca-Cola lata versão sem açúcar gelada de 350ml",
    price: 6.00,
    categories: ["Bebidas"],
    image: "/images/coca_cola_2l_1781053935428.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-3",
    name: "Fanta Uva 350ml",
    description: "Refrigerante Fanta sabor Uva em lata de 350ml super gelada",
    price: 6.00,
    categories: ["Bebidas"],
    image: "/images/fanta_grape_1781053559514.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-4",
    name: "Fanta Laranja 350ml",
    description: "Refrigerante Fanta Laranja refrescante em lata de 350ml bem gelada",
    price: 6.00,
    categories: ["Bebidas"],
    image: "/images/fanta_orange_1781053576954.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-5",
    name: "Sprite 350ml",
    description: "Refrigerante Sprite em lata refrescante sabor limão de 350ml",
    price: 6.00,
    categories: ["Bebidas"],
    image: "/images/sprite_can_1781053591910.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-7",
    name: "Coca-Cola 2 Litros",
    description: "Refrigerante Coca-Cola tamanho de 2 Litros perfeito para seu combinado",
    price: 15.00,
    categories: ["Bebidas"],
    image: "/images/coca_cola_2l_1781053935428.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  },
  {
    id: "bebida-8",
    name: "Coca-Cola 2 Litros (Zero)",
    description: "Refrigerante Coca-Cola sem açúcar tamanho de 2 Litros gelada",
    price: 15.00,
    categories: ["Bebidas"],
    image: "/images/coca_cola_2l_1781053935428.png",
    rating: 5.0,
    prepTime: "2-5 min",
    ingredients: [],
    availableToppings: []
  }
];

export const initialCoupons: Coupon[] = [];
