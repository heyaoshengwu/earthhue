export interface Pigment {
  id: string;
  name: string;
  nameZh: string;
  nameJa: string;
  nameKo: string;
  category: "plant" | "mineral" | "microbial";
  colors: string[];
  applications: string[];
  description: string;
  source: string;
  casNumber: string;
  einecsNumber: string;
  formulations: string[];
  regulations: {
    eu: string;
    us: string;
    japan: string;
    korea: string;
  };
}

export const pigments: Pigment[] = [
  // === PLANT-BASED ===
  {
    id: "curcumin",
    name: "Curcumin",
    nameZh: "姜黄素",
    nameJa: "クルクミン",
    nameKo: "커큐민",
    category: "plant",
    colors: ["#FF9F1C", "#FFBF00", "#E6A800"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Golden yellow pigment extracted from turmeric rhizome. Excellent for fat-based applications.",
    source: "Turmeric (Curcuma longa)",
    casNumber: "458-37-7",
    einecsNumber: "207-280-5",
    formulations: ["Oil dispersible", "Water dispersible", "Standard"],
    regulations: {
      eu: "E100 - Approved",
      us: "FDA GRAS - GRAS Notice 000131",
      japan: "Approved - JSFA IV",
      korea: "Approved - MFDS"
    }
  },
  {
    id: "beet-red",
    name: "Beet Red",
    nameZh: "甜菜红",
    nameJa: "ビートレッド",
    nameKo: "비트레드",
    category: "plant",
    colors: ["#C41E3A", "#8B0000", "#DC143C"],
    applications: ["food", "cosmetics"],
    description: "Vibrant red pigment from beet root. Sensitive to heat and light in low pH.",
    source: "Beta vulgaris (Beet root)",
    casNumber: "7659-50-9",
    einecsNumber: "231-628-5",
    formulations: ["Powder", "Liquid", "Microencapsulated"],
    regulations: {
      eu: "E162 - Approved",
      us: "FDA GRAS",
      japan: "Approved - JSFA IV",
      korea: "Approved - MFDS"
    }
  },
  {
    id: "chlorophyll",
    name: "Chlorophyll",
    nameZh: "叶绿素",
    nameJa: "クロロフィル",
    nameKo: "클로로필",
    category: "plant",
    colors: ["#2D5016", "#3A6B1E", "#4A7F24"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Natural green pigment. Copper-free chlorophyll available for sensitive applications.",
    source: "Alfalfa, Chlorella, Mulberry leaves",
    casNumber: "479-61-8",
    einecsNumber: "207-536-6",
    formulations: ["Oil soluble", "Water dispersible", "Copper complex"],
    regulations: {
      eu: "E140 - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "anthocyanin",
    name: "Anthocyanin",
    nameZh: "花青素",
    nameJa: "アントシアニン",
    nameKo: "안토시아닌",
    category: "plant",
    colors: ["#8B0044", "#C41E3A", "#6B2D5C", "#4A1C6B"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Red to purple pigment range. pH sensitive - color shifts with acidity.",
    source: "Grape skin, Black carrot, Purple sweet potato",
    casNumber: "11088-48-9",
    einecsNumber: "234-840-6",
    formulations: ["Grape-based", "Black carrot", "Purple sweet potato"],
    regulations: {
      eu: "E163 - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "carotenoid",
    name: "Natural Carotenoid",
    nameZh: "天然胡萝卜素",
    nameJa: "天然カロテノイド",
    nameKo: "천연 카로티노이드",
    category: "plant",
    colors: ["#FF6B00", "#FF8C00", "#FFA500", "#FFD700"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Orange to yellow pigments. Excellent heat stability. Beta-carotene is provitamin A.",
    source: "Blakeslea trispora, Palm oil, Annatto",
    casNumber: "7235-40-7",
    einecsNumber: "230-636-6",
    formulations: ["Oil suspension", "Powder", "Emulsion"],
    regulations: {
      eu: "E160a - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "paprika-oleoresin",
    name: "Paprika Oleoresin",
    nameZh: "辣椒油树脂",
    nameJa: "パプリカオレオレジン",
    nameKo: "파프리카 올레오레진",
    category: "plant",
    colors: ["#FF4500", "#FF6600", "#CC3300", "#FF5500"],
    applications: ["food", "cosmetics"],
    description: "Red-orange pigment from Capsicum annuum. Contains capsanthin and capsorubin.",
    source: "Capsicum annuum (Paprika)",
    casNumber: "90131-83-2",
    einecsNumber: "290-375-6",
    formulations: ["Oil soluble", "Standardized ASTA units", "Emulsifiable"],
    regulations: {
      eu: "E160c - Approved",
      us: "FDA GRAS",
      japan: "Approved - JSFA",
      korea: "Approved"
    }
  },
  {
    id: "saffron",
    name: "Saffron Carotenoid",
    nameZh: "藏花素",
    nameJa: "サフランカロテノイド",
    nameKo: "사프란 카로티노이드",
    category: "plant",
    colors: ["#FFB300", "#FFC107", "#FFD54F"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Golden yellow from Crocus sativus. Contains crocin - highest natural color intensity.",
    source: "Crocus sativus (Saffron)",
    casNumber: "2022-79-5",
    einecsNumber: "217-956-6",
    formulations: ["Standardized extracts", "Powder", "Liquid"],
    regulations: {
      eu: "E164 - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "lutein-plant",
    name: "Lutein (Marigold)",
    nameZh: "叶黄素（万寿菊）",
    nameJa: "ルテイン（マリーゴールド）",
    nameKo: "루테인（머리고드）",
    category: "plant",
    colors: ["#FFD700", "#FFA500", "#FF8C00"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Yellow pigment from Tagetes erecta. Important for eye health and blue light protection.",
    source: "Tagetes erecta (Marigold flower)",
    casNumber: "127-40-2",
    einecsNumber: "204-840-0",
    formulations: ["Oil suspension", "Water dispersible", "Powder"],
    regulations: {
      eu: "E161b - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },

  // === MICROBIAL / FERMENTATION ===
  {
    id: "astaxanthin",
    name: "Astaxanthin (Microbial)",
    nameZh: "虾青素（微生物发酵）",
    nameJa: "アスタキサンチン（微生物）",
    nameKo: "아스타잔신（미생물）",
    category: "microbial",
    colors: ["#FF4500", "#FF6B35", "#E63946", "#C41E3A"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Powerful antioxidant carotenoid - 550x stronger than vitamin E. The most commercially important microbial pigment. Natural astaxanthin from Haematococcus pluvialis is identical to wild-caught salmon.",
    source: "Haematococcus pluvialis (Chlorophyta)",
    casNumber: "472-61-7",
    einecsNumber: "207-451-4",
    formulations: ["Oil suspension", "Powder (1-10%)\"", "Water dispersible", "Standardized Beadlets"],
    regulations: {
      eu: "E161j - Approved",
      us: "FDA GRAS - GRAS Notice 000450",
      japan: "Approved - JSFA",
      korea: "Approved - MFDS"
    }
  },
  {
    id: "astaxanthin-synthetic-biological",
    name: "Astaxanthin (Phaffia)",
    nameZh: "红发夫酵母虾青素",
    nameJa: "ファフィア由来アスタキサンチン",
    nameKo: "파피아 유래 아스타잔신",
    category: "microbial",
    colors: ["#E63946", "#C41E3A", "#8B0000"],
    applications: ["food", "aquaculture", "cosmetics"],
    description: "Yeast-derived astaxanthin from Xanthophyllomyces dendrorhous (Phaffia rhodozyma). Used extensively in aquaculture for salmon coloring.",
    source: "Xanthophyllomyces dendrorhous (Phaffia rhodozyma)",
    casNumber: "11024-84-7",
    einecsNumber: "234-248-9",
    formulations: ["Powder", "Oil suspension", "Granular"],
    regulations: {
      eu: "E161j - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "beta-carotene-fermentation",
    name: "Beta-Carotene (Fermentation)",
    nameZh: "发酵β-胡萝卜素",
    nameJa: "発酵比利-Carotene",
    nameKo: "발효 베타카로틴",
    category: "microbial",
    colors: ["#FF6B00", "#FF8C00", "#FFA500"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Identical to plant-derived beta-carotene but produced via controlled fermentation. Consistent quality, higher purity, and sustainable production.",
    source: "Blakeslea trispora (fermentation)",
    casNumber: "7235-40-7",
    einecsNumber: "230-636-6",
    formulations: ["Crystalline", "Powder (1-10%)", "Oil suspension", "Emulsion"],
    regulations: {
      eu: "E160a - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "lutein-fermentation",
    name: "Lutein (Fermentation)",
    nameZh: "发酵叶黄素",
    nameJa: "発酵ルテイン",
    nameKo: "발효 루테인",
    category: "microbial",
    colors: ["#FFD700", "#FFA500", "#FF8C00"],
    applications: ["food", "pharmaceuticals"],
    description: "Microbial lutein with superior bioavailability. Chlorella-derived lutein shows 3x higher bioavailability than synthetic lutein.",
    source: "Chlorella vulgaris (fermentation)",
    casNumber: "127-40-2",
    einecsNumber: "204-840-0",
    formulations: ["Oil suspension", "Powder", "Water dispersible"],
    regulations: {
      eu: "E161b - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "canthaxanthin",
    name: "Canthaxanthin",
    nameZh: "角黄素",
    nameJa: "カンタキサンチン",
    nameKo: "칸타잔신",
    category: "microbial",
    colors: ["#FF4500", "#E63946", "#C41E3A"],
    applications: ["food", "aquaculture", "cosmetics"],
    description: "Orange-red carotenoid. Used in salmon farming for muscle coloration. Also used in food coloring and cosmetic bronzers.",
    source: "Paracoccus carotinifaciens, Chemical synthesis",
    casNumber: "514-78-3",
    einecsNumber: "208-187-2",
    formulations: ["Powder", "Oil suspension", "Beadlets"],
    regulations: {
      eu: "E161g - Approved (restricted use)",
      us: "FDA 21 CFR 73.95",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "torularhodin",
    name: "Torularhodin",
    nameZh: "红酵母红色素",
    nameJa: "トロラロジン",
    nameKo: "토룰라로딘",
    category: "microbial",
    colors: ["#C41E3A", "#8B0044", "#DC143C"],
    applications: ["food", "cosmetics"],
    description: "Carotenoid pigment from red yeast Rhodotorula. Rare but emerging as natural red alternative.",
    source: "Rhodotorula glutinis, Rhodosporidium",
    casNumber: "547-74-6",
    einecsNumber: "208-943-9",
    formulations: ["Powder", "Liquid", "Fermentation biomass"],
    regulations: {
      eu: "Under evaluation",
      us: "FDA GRAS (self-affirmed)",
      japan: "Not listed",
      korea: "Under review"
    }
  },
  {
    id: "monascus-red",
    name: "Monascus Red",
    nameZh: "红曲红色素",
    nameJa: "モナスカスレッド",
    nameKo: "모나스쿠스 레드",
    category: "microbial",
    colors: ["#8B0044", "#C41E3A", "#DC143C", "#FF4500"],
    applications: ["food", "cosmetics"],
    description: "Traditional fermented pigment from Monascus purpureus (red mold rice). Used in Asian cuisine for centuries. Contains citrinin-free grades.",
    source: "Monascus purpureus (red mold rice)",
    casNumber: "6852-11-7",
    einecsNumber: "229-912-6",
    formulations: ["Powder", "Oil soluble", "Water dispersible"],
    regulations: {
      eu: "E161c - Approved",
      us: "FDA GRAS (citrinin-free grades)",
      japan: "Approved - JSFA",
      korea: "Approved - MFDS"
    }
  },
  {
    id: "arrankin-red",
    name: "Arpink Red",
    nameZh: "阿宾红",
    nameJa: "アーピンクリンレッド",
    nameKo: "아르핀킨 레드",
    category: "microbial",
    colors: ["#C41E3A", "#DC143C", "#8B0000"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Natural red pigment from Penicillium oxalicum. Heat stable, pH stable, light stable. Novel natural color with excellent performance.",
    source: "Penicillium oxalicum (fermentation)",
    casNumber: "N/A (novel)",
    einecsNumber: "N/A",
    formulations: ["Powder", "Liquid", "Oil dispersible"],
    regulations: {
      eu: "Novel food application pending",
      us: "FDA GRAS (self-affirmed)",
      japan: "Under review",
      korea: "Under review"
    }
  },
  {
    id: "phycocyanin",
    name: "Phycocyanin (Spirulina)",
    nameZh: "藻蓝蛋白（螺旋藻）",
    nameJa: "フィコシアニン（スピルリナ）",
    nameKo: "피코시아닌（스피루리나）",
    category: "microbial",
    colors: ["#0055AA", "#0066CC", "#0077DD", "#0099EE"],
    applications: ["food", "cosmetics", "pharmaceuticals"],
    description: "Blue pigment-protein complex (C-phycocyanin). GRAS status. Used in beverages, confectionery, and dietary supplements. 20x sweeter than sugar.",
    source: "Arthrospira platensis (Spirulina)",
    casNumber: "11024-84-7",
    einecsNumber: "234-248-9",
    formulations: ["Powder (10-40% purity)", "Liquid", "Standardized extracts"],
    regulations: {
      eu: "E164 - Approved",
      us: "FDA GRAS",
      japan: "Approved - JSFA",
      korea: "Approved"
    }
  },
  {
    id: "phycoerythrin",
    name: "Phycoerythrin",
    nameZh: "藻红蛋白",
    nameJa: "フィコエリトリン",
    nameKo: "피코에리스린",
    category: "microbial",
    colors: ["#FF6B6B", "#FF4757", "#FF8A80", "#E91E63"],
    applications: ["food", "cosmetics", "diagnostics"],
    description: "Pink/red phycobiliprotein from Porphyridium cruentum. Exceptional fluorescent properties. Used in food as natural pink colorant and in flow cytometry.",
    source: "Porphyridium cruentum (red algae)",
    casNumber: "11024-48-7",
    einecsNumber: "N/A",
    formulations: ["Powder", "Liquid", "Standardized extracts"],
    regulations: {
      eu: "Approved (citrinin-free)",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "violaxanthin",
    name: "Violaxanthin",
    nameZh: "紫黄质",
    nameJa: "Violaxanthin",
    nameKo: "비올라잔신",
    category: "microbial",
    colors: ["#FFD93D", "#FFA500", "#FF8C00"],
    applications: ["food", "pharmaceuticals"],
    description: "Yellow carotenoid with excellent antioxidant properties. Found in algae and higher plants. Emerging as sustainable alternative to synthetic lutein.",
    source: "Nannochloropsis gaditana (microalgae)",
    casNumber: "74434-36-9",
    einecsNumber: "N/A",
    formulations: ["Oil suspension", "Powder", "Emulsion"],
    regulations: {
      eu: "Novel food status",
      us: "FDA GRAS",
      japan: "Not listed",
      korea: "Under review"
    }
  },
  {
    id: "zeaxanthin-microbial",
    name: "Zeaxanthin (Microbial)",
    nameZh: "玉米黄质（微生物）",
    nameJa: "ゼeaxanthin（微生物）",
    nameKo: "제아잔신（미생물）",
    category: "microbial",
    colors: ["#FFD700", "#FFA500", "#FF8C00"],
    applications: ["food", "pharmaceuticals", "cosmetics"],
    description: "Yellow carotenoid for eye health (macular pigment). Synthetic-biological production ensures consistent isomer ratio with lutein.",
    source: "Flavobacterium breve, Paracoccus zeaxanthinifaciens",
    casNumber: "144-68-3",
    einecsNumber: "205-648-2",
    formulations: ["Oil suspension", "Powder", "Beadlets"],
    regulations: {
      eu: "E161h - Approved",
      us: "FDA GRAS",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "spirulina-blue",
    name: "Spirulina Blue (C-Phycocyanin)",
    nameZh: "螺旋藻蓝",
    nameJa: "スピルリナブルー",
    nameKo: "스피루리나 블루",
    category: "microbial",
    colors: ["#0055AA", "#0066CC", "#0077DD"],
    applications: ["food", "cosmetics"],
    description: "Blue pigment from Arthrospira platensis. Phycocyanin - vibrant and stable. Premium food-grade with high color intensity.",
    source: "Arthrospira platensis (Spirulina)",
    casNumber: "11024-84-7",
    einecsNumber: "234-248-9",
    formulations: ["Powder", "Liquid", "Standardized extracts"],
    regulations: {
      eu: "E164 - Approved",
      us: "FDA GRAS",
      japan: "Approved - JSFA",
      korea: "Approved"
    }
  },

  // === MINERAL ===
  {
    id: "iron-oxide",
    name: "Iron Oxide",
    nameZh: "氧化铁",
    nameJa: "酸化鉄",
    nameKo: "산화철",
    category: "mineral",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#804000", "#450200"],
    applications: ["cosmetics", "pharmaceuticals", "food"],
    description: "Earth tones from yellow to red to brown. Extremely stable. FDA approved for cosmetics.",
    source: "Natural iron oxide minerals",
    casNumber: "1332-37-2",
    einecsNumber: "215-570-8",
    formulations: ["Natural", "Synthetic-identical", "Coated"],
    regulations: {
      eu: "E172 - Approved",
      us: "FDA 21 CFR 73.1200",
      japan: "Approved - CI 77491, 77492, 77499",
      korea: "Approved"
    }
  },
  {
    id: "titanium-dioxide",
    name: "Titanium Dioxide",
    nameZh: "二氧化钛",
    nameJa: "酸化チタン",
    nameKo: "이산화티타늄",
    category: "mineral",
    colors: ["#FFFFFF", "#F5F5F5", "#EEEEEE"],
    applications: ["cosmetics", "pharmaceuticals", "food"],
    description: "White pigment. UV protection in cosmetics. Opacifying agent.",
    source: "Ilmenite, Rutile",
    casNumber: "13463-67-7",
    einecsNumber: "236-675-5",
    formulations: ["Rutile", "Anatase", "Surface treated"],
    regulations: {
      eu: "E171 - Approved (restricted in cosmetics)",
      us: "FDA GRAS - 21 CFR 73.1",
      japan: "Approved",
      korea: "Approved"
    }
  },
  {
    id: "mica-pearl",
    name: "Mica Pearl",
    nameZh: "云母珠光",
    nameJa: "マイカパール",
    nameKo: "마이카 펄",
    category: "mineral",
    colors: ["#F5F5F5", "#E8E8E8", "#FFB6C1", "#E6E6FA"],
    applications: ["cosmetics", "food"],
    description: "Natural mica coated with titanium dioxide for pearlescent effect. Used in lipsticks, eyeshadows, and decorative food coatings.",
    source: "Natural muscovite mica",
    casNumber: "12001-26-2",
    einecsNumber: "310-127-6",
    formulations: ["Powder", "Pearl flake", "Fine grain"],
    regulations: {
      eu: "Approved - CI 77019",
      us: "FDA 21 CFR 73.1",
      japan: "Approved - CI 77019",
      korea: "Approved"
    }
  }
];
