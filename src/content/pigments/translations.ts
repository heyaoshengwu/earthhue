export type Locale = "en" | "zh" | "ja" | "ko" | "es" | "fr" | "de";

export interface PigmentTranslation {
  desc: string;
  source: string;
  apps: string[];
}

export const pigmentTranslations: Record<string, Record<Locale, PigmentTranslation>> = {
  "curcumin": {
    "en": {
      "desc": "Golden yellow pigment extracted from turmeric rhizome. Excellent for fat-based applications.",
      "source": "Turmeric (Curcuma longa)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "从姜黄根茎中提取的金黄色色素。非常适合油脂基应用。",
      "source": "姜黄 (Curcuma longa)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "ターメリック根茎から抽出された黄金色の色素。油性製品に最適。",
      "source": "ターメリック (Curcuma longa)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "강황 뿌리에서 추출된 금빛 노란색 색소. 유지 기반 제품에 적합.",
      "source": "강황 (Curcuma longa)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Pigmento amarillo dorado extraído de la cúrcuma. Excelente para aplicaciones grasas.",
      "source": "Cúrcuma (Curcuma longa)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Pigment jaune doré extrait du rhizome de curcuma. Excellent pour les applications lipidiques.",
      "source": "Curcuma (Curcuma longa)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Goldgelbes Pigment aus Kurkumawurzel. Hervorragend für fettbasierte Anwendungen.",
      "source": "Kurkuma (Curcuma longa)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "beet-red": {
    "en": {
      "desc": "Vibrant red pigment from beet root. Sensitive to heat and light in low pH.",
      "source": "Beta vulgaris (Beet root)",
      "apps": [
        "Food",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "来自甜菜根的鲜艳红色色素。在低pH值下对热和光敏感。",
      "source": "甜菜 (Beta vulgaris)",
      "apps": [
        "食品",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "ビート根から得られる鮮やかな赤色色素。低pHで熱・光に敏感。",
      "source": "ビート (Beta vulgaris)",
      "apps": [
        "食品",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "비트 뿌리에서 추출된 선명한 빨간색 색소. 낮은 pH에서 열과 빛에 민감.",
      "source": "비트 (Beta vulgaris)",
      "apps": [
        "식품",
        "화장품"
      ]
    },
    "es": {
      "desc": "Pigmento rojo vibrante de remolacha. Sensible al calor y la luz en pH bajo.",
      "source": "Beta vulgaris (Remolacha)",
      "apps": [
        "Alimentos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Pigment rouge vibrant de betterave. Sensible à la chaleur et à la lumière en pH bas.",
      "source": "Beta vulgaris (Betterave)",
      "apps": [
        "Alimentation",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Leuchtendes rotes Pigment aus Rote Bete. Empfindlich gegenüber Hitze und Licht bei niedrigem pH.",
      "source": "Beta vulgaris (Rote Bete)",
      "apps": [
        "Lebensmittel",
        "Kosmetik"
      ]
    }
  },
  "chlorophyll": {
    "en": {
      "desc": "Natural green pigment. Copper-free chlorophyll available for sensitive applications.",
      "source": "Alfalfa, Chlorella, Mulberry leaves",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "天然绿色色素。提供无铜叶绿素，适用于敏感应用。",
      "source": "紫花苜蓿、小球灵、桑叶",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "天然緑色色素。銅フリークロロフィルを感度の高い用途に提供。",
      "source": "アルファルファ、ケロレラ、桑の葉",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "천연 녹색 색소. 민감한 용도에 적합한 구리 프리 클로로필 제공.",
      "source": "알팔파, 클로렐라, 뽕잎",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Pigmento verde natural. Clorofila sin cobre disponible para aplicaciones sensibles.",
      "source": "Alfalfa, Chlorella, Hojas de morera",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Pigment vert naturel. Chlorophylle sans cuivre disponible pour les applications sensibles.",
      "source": "Luzerne, Chlorella, Feilles de mûrier",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Natürliches grünes Pigment. Kupferfreies Chlorophyll empfindliche Anwendungen.",
      "source": "Alfalfa, Chlorella, Maulbeerblätter",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "anthocyanin": {
    "en": {
      "desc": "Red to purple pigment range. pH sensitive - color shifts with acidity.",
      "source": "Grape skin, Black carrot, Purple sweet potato",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "红色至紫色色素范围。对pH敏感——颜色随酸度变化。",
      "source": "葡萄皮、黑胡萝卜、紫薯",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "赤から紫の色素レンジ。pH感受性 - 酸度に応じて色が変化。",
      "source": "ブドウ皮、黒人参、紫芋",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "빨간색에서 보라색 범위의 색소. pH에 민감 - 산도에 따라 색상이 변함.",
      "source": "포도 vỏ, 흑근당근, 자색고구마",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Rango de pigmentos del rojo al púrpura. Sensible al pH - el color cambia con la acidez.",
      "source": "Piel de uva, Zanahoria negra, Batata morada",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Gamme de pigments du rouge au pourpre. Sensible au pH - la couleur change avec l'acidité.",
      "source": "Peau de raisin, Carotte noire, Patate douce violette",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Rotes bis violette Pigmentpalette. pH-empfindlich - Farbe ändert sich mit Säure.",
      "source": "Traubenhaut, Schwarze Karotte, Süßkartoffel",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "carotenoid": {
    "en": {
      "desc": "Orange to yellow pigments. Excellent heat stability. Beta-carotene is provitamin A.",
      "source": "Blakeslea trispora, Palm oil, Annatto",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "橙色至黄色色素。出色的热稳定性。β-胡萝卜素是维生素A前体。",
      "source": "三孢布拉霉、棕榈油、胭脂树",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "オレンジから黄色の色素。優れた耐熱性。β-カロテンはビタミンA前駆体。",
      "source": "ブラクスレアトリスポラ、パルム油、アナトー",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "주황색에서 노란색 색소. 우수한 내열성. 베타카로틴은 비타민 A 전구체.",
      "source": "블라크스레아 트리스포라, 팜유, 아나토",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Pigmentos de naranja a amarillo. Excelente estabilidad al calor. El betacaroteno es provitamina A.",
      "source": "Blakeslea trispora, Aceite de palma, Achiotina",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Pigments orange à jaune. Excellente stabilité thermique. Le bêta-carotène est un provitamine A.",
      "source": "Blakeslea trispora, Huile de palme, Achiotina",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Orange bis gelbe Pigmente. Hervorragende Hitzebeständigkeit. Beta-Carotin ist Provitamin A.",
      "source": "Blakeslea trispora, Palmöl, Annatto",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "paprika-oleoresin": {
    "en": {
      "desc": "Red-orange pigment from Capsicum annuum. Contains capsanthin and capsorubin.",
      "source": "Capsicum annuum (Paprika)",
      "apps": [
        "Food",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "来自辣椒的红橙色色素。含有辣椒红素和辣椒玉红素。",
      "source": "辣椒 (Capsicum annuum)",
      "apps": [
        "食品",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "唐辛子からの赤橙色色素。カプサンチンとカプソルビンを含有。",
      "source": "唐辛子 (Capsicum annuum)",
      "apps": [
        "食品",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "고추에서 추출된 빨간색-주황색 색소. 캡산신과 캡소루빈 함유.",
      "source": "고추 (Capsicum annuum)",
      "apps": [
        "식품",
        "화장품"
      ]
    },
    "es": {
      "desc": "Pigmento rojo-anaranjado de Capsicum annuum. Contiene capsantina y capsorubina.",
      "source": "Capsicum annuum (Pimiento)",
      "apps": [
        "Alimentos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Pigment rouge-orange de Capsicum annuum. Contient la capsanthine et la capsorubine.",
      "source": "Capsicum annuum (Paprika)",
      "apps": [
        "Alimentation",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Rotes-orange Pigment aus Capsicum annuum. Enthält Capsanthin und Capsorubin.",
      "source": "Capsicum annuum (Paprika)",
      "apps": [
        "Lebensmittel",
        "Kosmetik"
      ]
    }
  },
  "saffron": {
    "en": {
      "desc": "Golden yellow from Crocus sativus. Contains crocin - highest natural color intensity.",
      "source": "Crocus sativus (Saffron)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "来自番红花的金黄色。含有藏花素——最高的天然色彩强度。",
      "source": "番红花 (Crocus sativus)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "サフランからの黄金色。クロシン含有 - 最高の天然色彩強度。",
      "source": "サフラン (Crocus sativus)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "사프란에서 추출된 금빛 노란색. 크로신 함유 - 최고의 천연 색상 강도.",
      "source": "사프란 (Crocus sativus)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Amarillo dorado de Crocus sativus. Contiene crocina - la mayor intensidad de color natural.",
      "source": "Crocus sativus (Azafrán)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Jaune doré de Crocus sativus. Contient la crocine - la plus grande intensité colorante naturelle.",
      "source": "Crocus sativus (Safran)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Goldgelb aus Crocus sativus. Enthält Crocin - höchste natürliche Farbintensität.",
      "source": "Crocus sativus (Safran)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "lutein-plant": {
    "en": {
      "desc": "Yellow pigment from Tagetes erecta. Important for eye health and blue light protection.",
      "source": "Tagetes erecta (Marigold flower)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "来自万寿菊的黄色色素。对眼睛健康和蓝光防护很重要。",
      "source": "万寿菊 (Tagetes erecta)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "マリーゴールドからの黄色色素。目の健康とブルーライト保護に重要。",
      "source": "マリーゴールド (Tagetes erecta)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "금잔화에서 추출된 노란색 색소. 눈 건강과 블루라이트 차단에 중요.",
      "source": "금잔화 (Tagetes erecta)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Pigmento amarillo de Tagetes erecta. Importante para la salud ocular y protección contra la luz azul.",
      "source": "Tagetes erecta (Flor de caléndula)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Pigment jaune de Tagetes erecta. Important pour la santé oculaire et la protection contre la lumière bleue.",
      "source": "Tagetes erecta (Fleur de souci)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Gelbes Pigment aus Tagetes erecta. Wichtig für die Augengesundheit und Blaulichtschutz.",
      "source": "Tagetes erecta (Ringelblume)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "astaxanthin": {
    "en": {
      "desc": "Powerful antioxidant carotenoid - 550x stronger than vitamin E. Natural astaxanthin identical to wild-caught salmon.",
      "source": "Haematococcus pluvialis (Chlorophyta)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "强效抗氧化类胡萝卜素——比维生素E强550倍。天然虾青素与野生三文鱼中的相同。",
      "source": "雨生红球藻 (Haematococcus pluvialis)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "強力抗酸化カロテノイド - ビタミンEの550倍。天然アスタキサンチンは天然サーモンと同一。",
      "source": "雨生紅球藻 (Haematococcus pluvialis)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "강력한 항산화 카로티노이드 - 비타민 E보다 550배 강함. 자연산 연어와 동일한 천연 아스타잔신.",
      "source": "우적적조 (Haematococcus pluvialis)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Potente carotenoide antioxidante - 550x más fuerte que la vitamina E. Idéntico al salmón salvaje.",
      "source": "Haematococcus pluvialis",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Caroténoïde antioxydant puissant - 550x plus fort que la vitamine E. Identique au saumon sauvage.",
      "source": "Haematococcus pluvialis",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Starkes Antioxidans-Carotinoid - 550x stärker als Vitamin E. Natürliches Astaxanthin identisch mit Wildlachs.",
      "source": "Haematococcus pluvialis",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "astaxanthin-synthetic-biological": {
    "en": {
      "desc": "Yeast-derived astaxanthin. Used extensively in aquaculture for salmon coloring.",
      "source": "Xanthophyllomyces dendrorhous (Phaffia rhodozyma)",
      "apps": [
        "Food",
        "Aquaculture",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "酵母来源的虾青素。广泛用于水产养殖中的三文鱼着色。",
      "source": "红发夫酵母 (Phaffia rhodozyma)",
      "apps": [
        "食品",
        "水产养殖",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "酵母由来アスタキサンチン。水産養殖でサーモン着色に広く使用。",
      "source": "ファフィア (Phaffia rhodozyma)",
      "apps": [
        "食品",
        "水産養殖",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "효모 유래 아스타잔신. 수산 양식에서 연어 착색에 널리 사용.",
      "source": "파피아 (Phaffia rhodozyma)",
      "apps": [
        "식품",
        "수산양식",
        "화장품"
      ]
    },
    "es": {
      "desc": "Astaxantina derivada de levadura. Ampliamente utilizada en acuicultura para colorear salmón.",
      "source": "Xanthophyllomyces dendrorhous",
      "apps": [
        "Alimentos",
        "Acuicultura",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Astaxanthine dérivée de levure. Utilisée en aquaculture pour la coloration du saumon.",
      "source": "Xanthophyllomyces dendrorhous",
      "apps": [
        "Alimentation",
        "Aquaculture",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Hefe-deriviertes Astaxanthin. Umfangreich in der Aquakultur zur Lachsfärbung verwendet.",
      "source": "Xanthophyllomyces dendrorhous",
      "apps": [
        "Lebensmittel",
        "Aquakultur",
        "Kosmetik"
      ]
    }
  },
  "beta-carotene-fermentation": {
    "en": {
      "desc": "Identical to plant-derived beta-carotene but produced via controlled fermentation. Consistent quality and sustainable.",
      "source": "Blakeslea trispora (fermentation)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "与植物来源β-胡萝卜素相同，但通过受控发酵生产。质量稳定、可持续。",
      "source": "三孢布拉霉 (发酵)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "植物由来β-カロテンと同一だが、制御発酵で生産。品質安定、持続可能。",
      "source": "ブラクスレアトリスポラ (発酵)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "식물 유래 베타카로틴과 동일하나 제어 발효로 생산. 일관된 품질, 지속 가능.",
      "source": "블라크스레아 트리스포라 (발효)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Idéntico al betacaroteno vegetal pero producido por fermentación controlada. Calidad consistente y sostenible.",
      "source": "Blakeslea trispora (fermentación)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Identique au bêta-carotène végétal mais produit par fermentation contrôlée. Qualité constante et durable.",
      "source": "Blakeslea trispora (fermentation)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Identisch mit pflanzlichem Beta-Carotin, aber durch kontrollierte Fermentation produziert. Konsistente Qualität und nachhaltig.",
      "source": "Blakeslea trispora (Fermentation)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "lutein-fermentation": {
    "en": {
      "desc": "Microbial lutein with superior bioavailability. Shows 3x higher bioavailability than synthetic lutein.",
      "source": "Chlorella vulgaris (fermentation)",
      "apps": [
        "Food",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "具有卓越生物利用度的微生物叶黄素。生物利用度是合成叶黄素的3倍。",
      "source": "小球藻 (发酵)",
      "apps": [
        "食品",
        "制药"
      ]
    },
    "ja": {
      "desc": "優れた生体利用率の微生物ルテイン。合成ルテインの3倍の生体利用率。",
      "source": "ケロレラバルガリス (発酵)",
      "apps": [
        "食品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "우수한 생체이용률의 미생물 루테인. 합성 루테인보다 3배 높은 생체이용률.",
      "source": "클로렐라 발가리스 (발효)",
      "apps": [
        "식품",
        "제약"
      ]
    },
    "es": {
      "desc": "Luteína microbiana con superior biodisponibilidad. 3x mayor biodisponibilidad que la luteína sintética.",
      "source": "Chlorella vulgaris (fermentación)",
      "apps": [
        "Alimentos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Lutéine microbienne avec une biodisponibilité supérieure. 3x plus biodisponible que la lutéine synthétique.",
      "source": "Chlorella vulgaris (fermentation)",
      "apps": [
        "Alimentation",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Mikrobielles Lutein mit überlegener Bioverfügbarkeit. 3x höhere Bioverfügbarkeit als synthetisches Lutein.",
      "source": "Chlorella vulgaris (Fermentation)",
      "apps": [
        "Lebensmittel",
        "Pharmazeutika"
      ]
    }
  },
  "canthaxanthin": {
    "en": {
      "desc": "Orange-red carotenoid. Used in salmon farming for muscle coloration.",
      "source": "Paracoccus carotinifaciens",
      "apps": [
        "Food",
        "Aquaculture",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "橙红色类胡萝卜素。用于三文鱼养殖中的肌肉着色。",
      "source": "类胡萝卜素副球菌",
      "apps": [
        "食品",
        "水产养殖",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "橙赤色カロテノイド。サーモン養殖で筋肉着色に使用。",
      "source": "パラコックスカロチニファシエンス",
      "apps": [
        "食品",
        "水産養殖",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "주황색-빨간색 카로티노이드. 연어 양식에서 근육 착색에 사용.",
      "source": "파라코쿠스 카로티니파시엔스",
      "apps": [
        "식품",
        "수산양식",
        "화장품"
      ]
    },
    "es": {
      "desc": "Carotenoide naranja-rojo. Usado en la acuicultura del salmón para colorear la carne.",
      "source": "Paracoccus carotinifaciens",
      "apps": [
        "Alimentos",
        "Acuicultura",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Caroténoïde orange-rouge. Utilisé dans l'élevage du saumon pour la coloration musculaire.",
      "source": "Paracoccus carotinifaciens",
      "apps": [
        "Alimentation",
        "Aquaculture",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Orange-rotes Carotinoid. In der Lachszucht zur Muszelfärbung verwendet.",
      "source": "Paracoccus carotinifaciens",
      "apps": [
        "Lebensmittel",
        "Aquakultur",
        "Kosmetik"
      ]
    }
  },
  "torularhodin": {
    "en": {
      "desc": "Carotenoid pigment from red yeast Rhodotorula. Emerging as natural red alternative.",
      "source": "Rhodotorula glutinis",
      "apps": [
        "Food",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "来自红酵母的类胡萝卜素色素。作为天然红色替代品正在兴起。",
      "source": "粘红酵母",
      "apps": [
        "食品",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "レッドイーストルロトラ由来のカロテノイド。天然赤色代替として注目。",
      "source": "ロドトルラグルチニス",
      "apps": [
        "食品",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "붉은 효모 로도토룰라에서 추출된 카로티노이드 색소. 천연 빨간색 대체재로 부상.",
      "source": "로도토룰라 글루티니스",
      "apps": [
        "식품",
        "화장품"
      ]
    },
    "es": {
      "desc": "Pigmento carotenoide de levadura roja Rhodotorula. Emergiendo como alternativa roja natural.",
      "source": "Rhodotorula glutinis",
      "apps": [
        "Alimentos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Pigment caroténoïde de la levure rouge Rhodotorula. Émerge comme alternative rouge naturelle.",
      "source": "Rhodotorula glutinis",
      "apps": [
        "Alimentation",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Carotinoidpigment aus roter Hefe Rhodotorula. Entwickelt sich zur natürlichen roten Alternative.",
      "source": "Rhodotorula glutinis",
      "apps": [
        "Lebensmittel",
        "Kosmetik"
      ]
    }
  },
  "monascus-red": {
    "en": {
      "desc": "Traditional fermented pigment from Monascus purpureus. Used in Asian cuisine for centuries.",
      "source": "Monascus purpureus (red mold rice)",
      "apps": [
        "Food",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "来自红曲的传统发酵色素。在亚洲料理中使用了数百年。",
      "source": "红曲 (Monascus purpureus)",
      "apps": [
        "食品",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "モナスカスプルプレウスの伝統的な発酵色素。アジア料理で何世紀も使用。",
      "source": "モナスカスプルプレウス (紅麹)",
      "apps": [
        "食品",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "붉은 곰팡이에서 추출된 전통 발효 색소. 아시아 요리에서 수세기 동안 사용됨.",
      "source": "모나스쿠스 퍼플레우스 (홍국)",
      "apps": [
        "식품",
        "화장품"
      ]
    },
    "es": {
      "desc": "Pigmento fermentado tradicional de Monascus purpureus. Usado en la cocina asiática durante siglos.",
      "source": "Monascus purpureus (arroz de moho rojo)",
      "apps": [
        "Alimentos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Pigment fermenté traditionnel de Monascus purpureus. Utilisé en cuisine asiatique depuis des siècles.",
      "source": "Monascus purpureus (riz de moisissure rouge)",
      "apps": [
        "Alimentation",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Traditionelles fermentiertes Pigment aus Monascus purpureus. Jahrhundertelang in der asiatischen Küche verwendet.",
      "source": "Monascus purpureus (roter Schimmelreis)",
      "apps": [
        "Lebensmittel",
        "Kosmetik"
      ]
    }
  },
  "arrankin-red": {
    "en": {
      "desc": "Natural red pigment from Penicillium oxalicum. Heat stable, pH stable, light stable.",
      "source": "Penicillium oxalicum (fermentation)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "来自青霉的天然红色色素。耐热、耐pH、耐光稳定。",
      "source": "草酸青霉 (发酵)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "ペニシリウムオキサリカムからの天然赤色色素。耐熱・耐pH・耐光性。",
      "source": "ペニシリウムオキサリカム (発酵)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "페니실리움 옥살리쿰에서 추출된 천연 빨간색 색소. 내열, 내pH, 내광성.",
      "source": "페니실리움 옥살리쿰 (발효)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Pigmento rojo natural de Penicillium oxalicum. Estable al calor, pH y luz.",
      "source": "Penicillium oxalicum (fermentación)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Pigment rouge naturel de Penicillium oxalicum. Stable à la chaleur, au pH et à la lumière.",
      "source": "Penicillium oxalicum (fermentation)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Natürliches rotes Pigment aus Penicillium oxalicum. Hitze-, pH- und lichtbeständig.",
      "source": "Penicillium oxalicum (Fermentation)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "phycocyanin": {
    "en": {
      "desc": "Blue pigment-protein complex. GRAS status. Used in beverages and dietary supplements.",
      "source": "Arthrospira platensis (Spirulina)",
      "apps": [
        "Food",
        "Cosmetics",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "蓝色色素蛋白复合物。GRAS认证。用于饮料和膳食补充剂。",
      "source": "钝顶螺旋藻 (Arthrospira platensis)",
      "apps": [
        "食品",
        "化妆品",
        "制药"
      ]
    },
    "ja": {
      "desc": "青色色素タンパク質複合体。GRAS認定。飲料とサプリメントに使用。",
      "source": "スピルリナ (Arthrospira platensis)",
      "apps": [
        "食品",
        "化粧品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "파란색 색소-단백질 복합체. GRAS 인증. 음료 및 건강보조식품에 사용.",
      "source": "스피루리나 (Arthrospira platensis)",
      "apps": [
        "식품",
        "화장품",
        "제약"
      ]
    },
    "es": {
      "desc": "Complejo proteína-pigmento azul. Estado GRAS. Usado en bebidas y suplementos.",
      "source": "Arthrospira platensis (Espirulina)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Complexe protéine-pigment bleu. Statut GRAS. Utilisé dans les boissons et compléments.",
      "source": "Arthrospira platensis (Spiruline)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Blaues Pigment-Protein-Komplex. GRAS-Status. Verwendet in Getränken und Nahrungsergänzungsmitteln.",
      "source": "Arthrospira platensis (Spirulina)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Pharmazeutika"
      ]
    }
  },
  "phycoerythrin": {
    "en": {
      "desc": "Pink/red phycobiliprotein from Porphyridium cruentum. Exceptional fluorescent properties.",
      "source": "Porphyridium cruentum (red algae)",
      "apps": [
        "Food",
        "Cosmetics",
        "Diagnostics"
      ]
    },
    "zh": {
      "desc": "来自紫球藻的粉红/红色藻胆蛋白。具有卓越的荧光特性。",
      "source": "紫球藻 (Porphyridium cruentum)",
      "apps": [
        "食品",
        "化妆品",
        "诊断"
      ]
    },
    "ja": {
      "desc": "ポルフィリジウムクルエンタムからのピンク/赤フィコビリタンパク質。優れた蛍光特性。",
      "source": "ポルフィリジウムクルエンタム (赤藻)",
      "apps": [
        "食品",
        "化粧品",
        "診断"
      ]
    },
    "ko": {
      "desc": "자색 적조에서 추출된 분홍/빨간색 피코빌리단백질. 뛰어난 형광 특성.",
      "source": "포르피리디움 크루엔텀 (적조)",
      "apps": [
        "식품",
        "화장품",
        "진단"
      ]
    },
    "es": {
      "desc": "Ficobiliproteína rosa/roja de Porphyridium cruentum. Propiedades fluorescentes excepcionales.",
      "source": "Porphyridium cruentum (alga roja)",
      "apps": [
        "Alimentos",
        "Cosméticos",
        "Diagnóstico"
      ]
    },
    "fr": {
      "desc": "Phycobiliprotéine rose/rouge de Porphyridium cruentum. Propétés fluorescentes exceptionnelles.",
      "source": "Porphyridium cruentum (algue rouge)",
      "apps": [
        "Alimentation",
        "Cosmétiques",
        "Diagnostique"
      ]
    },
    "de": {
      "desc": "Rosa/rotes Phycobiliprotein aus Porphyridium cruentum. Außergewöhnliche Fluoreszenzeigenschaften.",
      "source": "Porphyridium cruentum (Rotalge)",
      "apps": [
        "Lebensmittel",
        "Kosmetik",
        "Diagnostik"
      ]
    }
  },
  "violaxanthin": {
    "en": {
      "desc": "Yellow carotenoid with excellent antioxidant properties. Emerging as sustainable alternative.",
      "source": "Nannochloropsis gaditana (microalgae)",
      "apps": [
        "Food",
        "Pharmaceuticals"
      ]
    },
    "zh": {
      "desc": "具有出色抗氧化性能的黄色类胡萝卜素。作为可持续替代品正在兴起。",
      "source": "微拟球藻 (微藻)",
      "apps": [
        "食品",
        "制药"
      ]
    },
    "ja": {
      "desc": "優れた抗酸化特性の黄色カロテノイド。持続可能な代替として注目。",
      "source": "ナノクロロプシスガディタナ (微細藻類)",
      "apps": [
        "食品",
        "製薬"
      ]
    },
    "ko": {
      "desc": "우수한 항산화 특성을 가진 노란색 카로티노이드. 지속 가능한 대체재로 부상.",
      "source": "나노클로로プ시스 가디타나 (미세조류)",
      "apps": [
        "식품",
        "제약"
      ]
    },
    "es": {
      "desc": "Carotenoide amarillo con excelentes propiedades antioxidantes. Emergiendo como alternativa sostenible.",
      "source": "Nannochloropsis gaditana (microalga)",
      "apps": [
        "Alimentos",
        "Farmacéuticos"
      ]
    },
    "fr": {
      "desc": "Caroténoïde jaune avec d'excellentes propriétés antioxydantes. Émerge comme alternative durable.",
      "source": "Nannochloropsis gaditana (microalgue)",
      "apps": [
        "Alimentation",
        "Pharmaceutiques"
      ]
    },
    "de": {
      "desc": "Gelbes Carotinoid mit hervorragenden antioxidativen Eigenschaften. Entwickelt sich zur nachhaltigen Alternative.",
      "source": "Nannochloropsis gaditana (Mikroalge)",
      "apps": [
        "Lebensmittel",
        "Pharmazeutika"
      ]
    }
  },
  "zeaxanthin-microbial": {
    "en": {
      "desc": "Yellow carotenoid for eye health (macular pigment). Consistent isomer ratio with lutein.",
      "source": "Flavobacterium breve, Paracoccus zeaxanthinifaciens",
      "apps": [
        "Food",
        "Pharmaceuticals",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "用于眼睛健康（黄斑色素）的黄色类胡萝卜素。与叶黄素具有稳定的异构体比例。",
      "source": "短黄杆菌、产玉米黄素副球菌",
      "apps": [
        "食品",
        "制药",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "目の健康（黄斑色素）のための黄色カロテノイド。ルテインと安定したイソマー比率。",
      "source": "フラボバクテリウムブレーブ、パラコックスゼアキサンチニファシエンス",
      "apps": [
        "食品",
        "製薬",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "눈 건황 (황반 색소)을 위한 노란색 카로티노이드. 루테인과 일관된 이성질체 비율.",
      "source": "플라보박테리움 브레베, 파라코쿠스 제아잔티니파시엔스",
      "apps": [
        "식품",
        "제약",
        "화장품"
      ]
    },
    "es": {
      "desc": "Carotenoide amarillo para la salud ocular (pigmento macular). Relación de isómeros consistente.",
      "source": "Flavobacterium breve, Paracoccus zeaxanthinifaciens",
      "apps": [
        "Alimentos",
        "Farmacéuticos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Caroténoïde jaune pour la santé oculaire (pigment maculaire). Rapport d'isomères constant.",
      "source": "Flavobacterium breve, Paracoccus zeaxanthinifaciens",
      "apps": [
        "Alimentation",
        "Pharmaceutiques",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Gelbes Carotinoid für die Augengesundheit (Maculapigment). Konsistentes Isomer-Verhältnis mit Lutein.",
      "source": "Flavobacterium breve, Paracoccus zeaxanthinifaciens",
      "apps": [
        "Lebensmittel",
        "Pharmazeutika",
        "Kosmetik"
      ]
    }
  },
  "spirulina-blue": {
    "en": {
      "desc": "Blue pigment from Arthrospira platensis. Vibrant and stable. Premium food-grade.",
      "source": "Arthrospira platensis (Spirulina)",
      "apps": [
        "Food",
        "Cosmetics"
      ]
    },
    "zh": {
      "desc": "来自螺旋藻的蓝色色素。鲜艳稳定。优质食品级。",
      "source": "钝顶螺旋藻 (Arthrospira platensis)",
      "apps": [
        "食品",
        "化妆品"
      ]
    },
    "ja": {
      "desc": "スピルリナからの青色色素。鮮やかで安定。プレミアム食品グレード。",
      "source": "スピルリナ (Arthrospira platensis)",
      "apps": [
        "食品",
        "化粧品"
      ]
    },
    "ko": {
      "desc": "스피루리나에서 추출된 파란색 색소. 선명하고 안정적. 프리미엄 식품 등급.",
      "source": "스피루리나 (Arthrospira platensis)",
      "apps": [
        "식품",
        "화장품"
      ]
    },
    "es": {
      "desc": "Pigmento azul de Arthrospira platensis. Vibrante y estable. Grado alimentario premium.",
      "source": "Arthrospira platensis (Espirulina)",
      "apps": [
        "Alimentos",
        "Cosméticos"
      ]
    },
    "fr": {
      "desc": "Pigment bleu d'Arthrospira platensis. Vibrant et stable. Grade alimentaire premium.",
      "source": "Arthrospira platensis (Spiruline)",
      "apps": [
        "Alimentation",
        "Cosmétiques"
      ]
    },
    "de": {
      "desc": "Blaues Pigment aus Arthrospira platensis. Leuchtend und stabil. Premium-Lebensmittelqualität.",
      "source": "Arthrospira platensis (Spirulina)",
      "apps": [
        "Lebensmittel",
        "Kosmetik"
      ]
    }
  },
  "iron-oxide": {
    "en": {
      "desc": "Earth tones from yellow to red to brown. Extremely stable. FDA approved for cosmetics.",
      "source": "Natural iron oxide minerals",
      "apps": [
        "Cosmetics",
        "Pharmaceuticals",
        "Food"
      ]
    },
    "zh": {
      "desc": "从黄色到红色到棕色的大地色调。极其稳定。FDA批准用于化妆品。",
      "source": "天然氧化铁矿物",
      "apps": [
        "化妆品",
        "制药",
        "食品"
      ]
    },
    "ja": {
      "desc": "黄色から赤、茶色のアーストーン。極めて安定。化粧品用FDA承認。",
      "source": "天然酸化鉱物",
      "apps": [
        "化粧品",
        "製薬",
        "食品"
      ]
    },
    "ko": {
      "desc": "노란색에서 빨간색, 갈색까지의 어스톤. 극도로 안정적. 화장품용 FDA 승인.",
      "source": "천연 산화철 광물",
      "apps": [
        "화장품",
        "제약",
        "식품"
      ]
    },
    "es": {
      "desc": "Tonos tierra de amarillo a rojo a marrón. Extremadamente estable. Aprobado por FDA para cosméticos.",
      "source": "Minerales de óxido de hierro natural",
      "apps": [
        "Cosméticos",
        "Farmacéuticos",
        "Alimentos"
      ]
    },
    "fr": {
      "desc": "Tons terre du jaune au rouge au marron. Extrêmement stable. Approuvé par la FDA pour les cosmétiques.",
      "source": "Minéraux d'oxyde de fer naturel",
      "apps": [
        "Cosmétiques",
        "Pharmaceutiques",
        "Alimentation"
      ]
    },
    "de": {
      "desc": "Erdtöne von Gelb über Rot bis Braun. Extrem stabil. FDA-genehmigt für Kosmetik.",
      "source": "Natürliche Eisenoxidmineralien",
      "apps": [
        "Kosmetik",
        "Pharmazeutika",
        "Lebensmittel"
      ]
    }
  },
  "titanium-dioxide": {
    "en": {
      "desc": "White pigment. UV protection in cosmetics. Opacifying agent.",
      "source": "Ilmenite, Rutile",
      "apps": [
        "Cosmetics",
        "Pharmaceuticals",
        "Food"
      ]
    },
    "zh": {
      "desc": "白色色素。化妆品中的紫外线防护。遮光剂。",
      "source": "钛铁矿、金红石",
      "apps": [
        "化妆品",
        "制药",
        "食品"
      ]
    },
    "ja": {
      "desc": "白色色素。化粧品での紫外線保護。遮光剤。",
      "source": "イルメナイト、ルチル",
      "apps": [
        "化粧品",
        "製薬",
        "食品"
      ]
    },
    "ko": {
      "desc": "흰색 색소. 화장품에서 자외선 차단. 불투명제.",
      "source": "일메나이트, 루틸",
      "apps": [
        "화장품",
        "제약",
        "식품"
      ]
    },
    "es": {
      "desc": "Pigmento blanco. Protección UV en cosméticos. Agente opacificante.",
      "source": "Ilmenita, Rutilo",
      "apps": [
        "Cosméticos",
        "Farmacéuticos",
        "Alimentos"
      ]
    },
    "fr": {
      "desc": "Pigment blanc. Protection UV dans les cosmétiques. Agent opacifiant.",
      "source": "Ilménite, Rutile",
      "apps": [
        "Cosmétiques",
        "Pharmaceutiques",
        "Alimentation"
      ]
    },
    "de": {
      "desc": "Weißes Pigment. UV-Schutz in Kosmetik. Opazitätsmittel.",
      "source": "Ilmenit, Rutil",
      "apps": [
        "Kosmetik",
        "Pharmazeutika",
        "Lebensmittel"
      ]
    }
  },
  "mica-pearl": {
    "en": {
      "desc": "Natural mica coated with titanium dioxide for pearlescent effect. Used in lipsticks and eyeshadows.",
      "source": "Natural muscovite mica",
      "apps": [
        "Cosmetics",
        "Food"
      ]
    },
    "zh": {
      "desc": "涂有二氧化钛的天然云母，产生珠光效果。用于口红和眼影。",
      "source": "天然白云母",
      "apps": [
        "化妆品",
        "食品"
      ]
    },
    "ja": {
      "desc": "酸化チタンでコーティングされた天然マイカ。パール効果。口紅やアイシャドウに使用。",
      "source": "天然白雲母",
      "apps": [
        "化粧品",
        "食品"
      ]
    },
    "ko": {
      "desc": "이산화티타늄으로 코팅된 천연 마이카. 펄 효과. 립스틱과 아이섀도에 사용.",
      "source": "천연 백마이카",
      "apps": [
        "화장품",
        "식품"
      ]
    },
    "es": {
      "desc": "Mica natural recubierta de dióxido de titanio para efecto perlado. Usada en labiales y sombras.",
      "source": "Mica moscovita natural",
      "apps": [
        "Cosméticos",
        "Alimentos"
      ]
    },
    "fr": {
      "desc": "Mica naturel revêtu de dioxyde de titane pour un effet nacré. Utilisé dans les rouges à lèvres.",
      "source": "Mica muscovite naturel",
      "apps": [
        "Cosmétiques",
        "Alimentation"
      ]
    },
    "de": {
      "desc": "Naturmica mit Titandioxid beschichtet für Perlglanz. Verwendet in Lippenstiften und Lidschatten.",
      "source": "Natur-Muskovit-Mica",
      "apps": [
        "Kosmetik",
        "Lebensmittel"
      ]
    }
  }
};
