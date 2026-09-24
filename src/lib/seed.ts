export type AboutCommitment = {
  title: string;
  desc: string;
};

export type AboutTranslations = {
  title?: string;
  subtitle?: string;
  missionTitle?: string;
  mission?: string;
  visionTitle?: string;
  vision?: string;
  whyTitle?: string;
  whyBody?: string;
  commitmentTitle?: string;
  commitmentItems?: AboutCommitment[];
  certificationsTitle?: string;
  certifications?: string[];
};

export function defaultAboutTranslations(): Record<string, AboutTranslations> {
  return {
    en: {
      title: "About EarthHue",
      subtitle: "Premium natural pigments for food and cosmetics — sustainably sourced, globally compliant.",
      missionTitle: "Our Mission",
      mission: "Provide manufacturers with reliable, sustainable natural color solutions meeting the strictest global regulatory requirements.",
      visionTitle: "Our Vision",
      vision: "A world where natural color replaces synthetic alternatives, creating safer products for people and the environment.",
      whyTitle: "Why Choose Natural?",
      whyBody: "Global demand for clean-label products continues to grow. Natural pigments offer an attractive alternative to synthetic colors while meeting EU, US, Japan, Korea, and Southeast Asia standards.",
      commitmentTitle: "Our Commitment",
      commitmentItems: [
        { title: "Quality Assurance", desc: "Every batch is tested for purity, stability, and regulatory compliance." },
        { title: "Sustainable Sourcing", desc: "We partner with suppliers who value environmental stewardship." },
        { title: "Technical Support", desc: "Our application team helps customers select and implement the right pigment." },
        { title: "Global Compliance", desc: "We maintain up-to-date regulatory documentation for all major markets." },
      ],
      certificationsTitle: "Certifications",
      certifications: ["ISO 22000", "FSSC 22000", "FDA Registered", "EU Food Grade", "Kosher", "Halal"],
    },
    zh: {
      title: "关于 EarthHue",
      subtitle: "优质天然色素应用于食品与化妆品——可持续来源，符合全球标准。",
      missionTitle: "我们的使命",
      mission: "为制造商提供可靠、可持续的天然着色方案，满足全球市场最严格的法规要求。",
      visionTitle: "我们的愿景",
      vision: "一个天然色彩取代合成替代品的世界，为人类和环境创造更安全的产品。",
      whyTitle: "为什么选择天然？",
      whyBody: "全球消费者对清洁标签产品的需求持续增长。天然色素在满足欧盟、美国、日本、韩国及东南亚严格法规标准的同时，为合成色素提供了极具吸引力的替代方案。",
      commitmentTitle: "我们的承诺",
      commitmentItems: [
        { title: "质量保证", desc: "每一批次都经过严格的纯度、稳定性和法规合规性测试。" },
        { title: "可持续采购", desc: "我们与重视环境管理的负责任供应商合作。" },
        { title: "技术支持", desc: "我们的应用团队帮助客户选择并实施适合其特定需求的色素。" },
        { title: "全球合规", desc: "我们为所有主要市场维护最新的法规文件。" },
      ],
      certificationsTitle: "资质认证",
      certifications: ["ISO 22000", "FSSC 22000", "FDA 注册", "欧盟食品级", "犹太 Kosher", "清真 Halal"],
    },
    ja: {
      title: "EarthHue について",
      subtitle: "食品・化粧品向けの高品質天然色素 ― 持続可能な調達、世界基準への準拠。",
      missionTitle: "私たちの使命",
      mission: "メーカーに信頼性と持続可能性を兼ね備えた天然着色ソリューションを提供し、世界で最も厳格な規制要件を満たす。",
      visionTitle: "私たちのビジョン",
      vision: "天然色素が合成代替品に取って代わり、人と環境にとってより安全な製品が実現する世界。",
      whyTitle: "なぜ天然色素を選ぶのか",
      whyBody: "クリーンラベル製品への世界的な需要は拡大し続けています。天然色素は EU・米国・日本・韓国・東南アジアの基準を満たしながら、合成色素の魅力的な代替品となります。",
      commitmentTitle: "私たちの取り組み",
      commitmentItems: [
        { title: "品質保証", desc: "すべてのバッチで純度・安定性・法令適合を試験。" },
        { title: "持続可能な調達", desc: "環境管理を重視する責任あるサプライヤーと協業。" },
        { title: "テクニカルサポート", desc: "アプリケーションチームが最適な色素選定・実装を支援。" },
        { title: "グローバルコンプライアンス", desc: "主要市場ごとに最新の規制文書を整備。" },
      ],
      certificationsTitle: "認証",
      certifications: ["ISO 22000", "FSSC 22000", "FDA 登録", "EU 食品グレード", "コーシャ", "ハラール"],
    },
    ko: {
      title: "EarthHue 소개",
      subtitle: "식품·화장품용 프리미엄 천연 색소 — 지속 가능한 공급, 글로벌 컴플라이언스.",
      missionTitle: "우리의 사명",
      mission: "제조업체에 신뢰할 수 있고 지속 가능한 천연 컬러 솔루션을 제공하여 가장 엄격한 글로벌 규제 요건을 충족합니다.",
      visionTitle: "우리의 비전",
      vision: "천연 컬러가 합성 대체재를 대체하여 사람과 환경 모두에게 더 안전한 세상을 만듭니다.",
      whyTitle: "왜 천연 색소인가",
      whyBody: "클린라벨 제품에 대한 글로벌 수요는 계속 증가하고 있습니다. 천연 색소는 EU, 미국, 일본, 한국, 동남아시아 기준을 충족하면서 합성 색소의 매력적인 대안을 제공합니다.",
      commitmentTitle: "우리의 약속",
      commitmentItems: [
        { title: "품질 보증", desc: "모든 배치의 순도·안정성·규제 적합성을 테스트합니다." },
        { title: "지속 가능한 소싱", desc: "환경 책임을 중시하는 공급업체와 협력합니다." },
        { title: "기술 지원", desc: "애플리케이션 팀이 고객의 색소 선정과 구현을 지원합니다." },
        { title: "글로벌 컴플라이언스", desc: "모든 주요 시장에 최신 규제 문서를 유지합니다." },
      ],
      certificationsTitle: "인증",
      certifications: ["ISO 22000", "FSSC 22000", "FDA 등록", "EU 식품 등급", "코셔", "할랄"],
    },
    es: {
      title: "Sobre EarthHue",
      subtitle: "Pigmentos naturales premium para alimentación y cosmética — origen sostenible, conformidad global.",
      missionTitle: "Nuestra Misión",
      mission: "Ofrecer a los fabricantes soluciones de color natural fiables y sostenibles que cumplan los requisitos regulatorios más exigentes.",
      visionTitle: "Nuestra Visión",
      vision: "Un mundo donde el color natural reemplace a los alternativos sintéticos, creando productos más seguros.",
      whyTitle: "¿Por qué elegir color natural?",
      whyBody: "La demanda global de productos clean-label sigue creciendo. Los pigmentos naturales cumplen con los estándares de la UE, EE. UU., Japón, Corea y el sudeste asiático.",
      commitmentTitle: "Nuestro Compromiso",
      commitmentItems: [
        { title: "Garantía de Calidad", desc: "Cada lote se prueba en pureza, estabilidad y cumplimiento normativo." },
        { title: "Abastecimiento Sostenible", desc: "Trabajamos con proveedores responsables con el medio ambiente." },
        { title: "Soporte Técnico", desc: "Nuestro equipo de aplicación ayuda a seleccionar e implementar el pigmento adecuado." },
        { title: "Cumplimiento Global", desc: "Mantenemos documentación regulatoria actualizada para los principales mercados." },
      ],
      certificationsTitle: "Certificaciones",
      certifications: ["ISO 22000", "FSSC 22000", "FDA Registrado", "UE Food Grade", "Kosher", "Halal"],
    },
    fr: {
      title: "À propos d'EarthHue",
      subtitle: "Pigments naturels premium pour l'agroalimentaire et la cosmétique — approvisionnement durable, conformité mondiale.",
      missionTitle: "Notre Mission",
      mission: "Fournir aux fabricants des solutions de couleur naturelles fiables et durables répondant aux exigences réglementaires les plus strictes.",
      visionTitle: "Notre Vision",
      vision: "Un monde où la couleur naturelle supplante les colorants synthétiques, pour des produits plus sûrs.",
      whyTitle: "Pourquoi choisir le naturel ?",
      whyBody: "La demande mondiale pour les produits clean-label continue de croître. Les pigments naturels offrent une option séduisante aux couleurs synthétiques tout en respectant les normes UE, US, Japon, Corée et Asie du Sud-Est.",
      commitmentTitle: "Notre Engagement",
      commitmentItems: [
        { title: "Assurance Qualité", desc: "Chaque lot est testé pour la pureté, la stabilité et la conformité réglementaire." },
        { title: "Approvisionnement Durable", desc: "Nous travaillons avec des fournisseurs respectueux de l'environnement." },
        { title: "Support Technique", desc: "Notre équipe d'application accompagne le choix et la mise en œuvre du pigment." },
        { title: "Conformité Mondiale", desc: "Nous maintenons une documentation réglementaire à jour pour les principaux marchés." },
      ],
      certificationsTitle: "Certifications",
      certifications: ["ISO 22000", "FSSC 22000", "FDA Enregistré", "UE Food Grade", "Casher", "Halal"],
    },
    de: {
      title: "Über EarthHue",
      subtitle: "Premium-Naturpigmente für Lebensmittel und Kosmetik — nachhaltige Beschaffung, globale Konformität.",
      missionTitle: "Unsere Mission",
      mission: "Hersteller mit zuverlässigen, nachhaltigen Naturfarblösungen zu versorgen, die strengste regulatorische Anforderungen erfüllen.",
      visionTitle: "Unsere Vision",
      vision: "Eine Welt, in der natürliche Farben synthetische Alternativen ersetzen — für Mensch und Umwelt sicherer.",
      whyTitle: "Warum natürlich wählen?",
      whyBody: "Die globale Nachfrage nach Clean-Label-Produkten wächst weiter. Naturpigmente erfüllen EU-, US-, Japan-, Korea- und Südostasien-Standards und bieten eine attraktive Alternative zu synthetischen Farben.",
      commitmentTitle: "Unser Engagement",
      commitmentItems: [
        { title: "Qualitätssicherung", desc: "Jede Charge wird auf Reinheit, Stabilität und regulatorische Konformität geprüft." },
        { title: "Nachhaltige Beschaffung", desc: "Wir arbeiten mit Lieferanten, die Umweltverantwortung leben." },
        { title: "Technischer Support", desc: "Unser Anwendungsteam unterstützt bei Auswahl und Umsetzung des passenden Pigments." },
        { title: "Globale Konformität", desc: "Wir pflegen aktuelle regulatorische Dokumentation für alle wichtigen Märkte." },
      ],
      certificationsTitle: "Zertifizierungen",
      certifications: ["ISO 22000", "FSSC 22000", "FDA Registriert", "EU Food Grade", "Koscher", "Halal"],
    },
  };
}

export function defaultArticles() {
  return [
    {
      slug: "welcome-to-earthhue",
      translations: {
        en: {
          title: "Welcome to EarthHue",
          excerpt: "Our story, our standards, and what we ship.",
          body: "EarthHue supplies natural pigments for food and cosmetics manufacturers worldwide. We focus on regulatory compliance, sustainable sourcing, and consistent quality.\n\nEvery batch is tested, every certificate is current, and every shipment is tracked. Reach out via our contact form if you'd like samples or technical documentation.",
        },
        zh: {
          title: "欢迎来到 EarthHue",
          excerpt: "我们的故事、标准以及交付内容。",
          body: "EarthHue 为全球食品与化妆品制造商提供天然色素。我们专注于法规合规、可持续采购以及稳定品质。\n\n每一批次都经过检测，每一份证书都保持最新，每一票货物都可追踪。如需样品或技术文档，请通过联系表单与我们联系。",
        },
      },
      cover_image: null,
      published: 1,
    },
  ];
}

export function defaultProducts() {
  return [
    {
      slug: "eh-curcumin-10",
      translations: {
        en: {
          name: "EarthHue Curcumin 10",
          description: "High stability curcuminoid suspension for oil-based applications.",
          applications: ["Beverages", "Confectionery", "Bakery"],
        },
        zh: {
          name: "EarthHue 姜黄素 10",
          description: "高稳定性姜黄素悬浮液，适用于油性配方。",
          applications: ["饮料", "糖果", "烘焙"],
        },
      },
      base: "Curcumin",
      form: "Oil Dispersible",
      color: "#FF9F1C",
      sort_order: 1,
      published: 1,
    },
    {
      slug: "eh-beet-20",
      translations: {
        en: {
          name: "EarthHue Beet Red 20",
          description: "Heat-stable beetroot pigment with protective coating.",
          applications: ["Dairy", "Frozen foods", "Snacks"],
        },
        zh: {
          name: "EarthHue 甜菜红 20",
          description: "耐热甜菜根色素，带保护涂层。",
          applications: ["乳制品", "冷冻食品", "零食"],
        },
      },
      base: "Beet Red",
      form: "Microencapsulated",
      color: "#C41E3A",
      sort_order: 2,
      published: 1,
    },
    {
      slug: "eh-anthocyanin-30",
      translations: {
        en: {
          name: "EarthHue Antho-Mix 30",
          description: "pH-stable grape-black carrot blend for versatile applications.",
          applications: ["Beverages", "Functional foods", "Supplements"],
        },
        zh: {
          name: "EarthHue 花青素 30",
          description: "pH 稳定的葡萄-黑胡萝卜复配色素，适用于多种应用。",
          applications: ["饮料", "功能食品", "膳食补充剂"],
        },
      },
      base: "Anthocyanin Blend",
      form: "Water Soluble",
      color: "#8B0044",
      sort_order: 3,
      published: 1,
    },
    {
      slug: "eh-chlorophyll-40",
      translations: {
        en: {
          name: "EarthHue Chlorophyll 40",
          description: "Natural green with copper-free formulation for clean label.",
          applications: ["Tea beverages", "Mint products", "Health foods"],
        },
        zh: {
          name: "EarthHue 叶绿素 40",
          description: "无铜配方天然绿色素，适合清洁标签。",
          applications: ["茶饮料", "薄荷产品", "健康食品"],
        },
      },
      base: "Chlorophyll",
      form: "Copper-Free",
      color: "#2D5016",
      sort_order: 4,
      published: 1,
    },
    {
      slug: "eh-astaxanthin-100",
      translations: {
        en: {
          name: "EarthHue Asta-Max 100",
          description: "Premium microbial astaxanthin — 550x stronger antioxidant than vitamin E.",
          applications: ["Aquaculture", "Salmon farming", "Sports nutrition", "Cosmetics"],
        },
        zh: {
          name: "EarthHue 虾青素 100",
          description: "高端微生物发酵虾青素——抗氧化能力是维生素 E 的 550 倍。",
          applications: ["水产养殖", "三文鱼养殖", "运动营养", "化妆品"],
        },
      },
      base: "Astaxanthin (Haematococcus)",
      form: "Oil Suspension 5%",
      color: "#FF4500",
      sort_order: 5,
      published: 1,
    },
    {
      slug: "eh-phycocyanin-140",
      translations: {
        en: {
          name: "EarthHue Cyano-Blue 140",
          description: "Premium blue pigment from Spirulina. GRAS status.",
          applications: ["Beverages", "Ice cream", "Confectionery", "Dietary supplements"],
        },
        zh: {
          name: "EarthHue 藻蓝蛋白 140",
          description: "源自螺旋藻的高端蓝色素，GRAS 状态。",
          applications: ["饮料", "冰淇淋", "糖果", "膳食补充剂"],
        },
      },
      base: "C-Phycocyanin",
      form: "Powder 25%",
      color: "#0066CC",
      sort_order: 6,
      published: 1,
    },
  ];
}