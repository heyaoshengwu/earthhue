#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");

const LOCALE_DEFAULTS = {
  nav: {
    articles: { en: "Articles", zh: "文章", ja: "記事", ko: "기사", es: "Artículos", fr: "Articles", de: "Artikel" },
  },
  home: {
    heroEyebrow: {
      en: "Premium natural pigments for industry",
      zh: "面向工业的优质天然色素",
      ja: "産業向けプレミアム天然色素",
      ko: "산업용 프리미엄 천연 색소",
      es: "Pigmentos naturales premium para la industria",
      fr: "Pigments naturels premium pour l'industrie",
      de: "Premium-Naturpigmente für die Industrie",
    },
    primaryCta: {
      en: "Browse Products",
      zh: "查看产品",
      ja: "製品を見る",
      ko: "제품 보기",
      es: "Ver productos",
      fr: "Voir les produits",
      de: "Produkte ansehen",
    },
    secondaryCta: {
      en: "Contact Our Team",
      zh: "联系我们",
      ja: "お問い合わせ",
      ko: "문의하기",
      es: "Contactar",
      fr: "Nous contacter",
      de: "Kontakt aufnehmen",
    },
    featuredProducts: {
      title: { en: "Featured Products", zh: "精选产品", ja: "注目製品", ko: "추천 제품", es: "Productos destacados", fr: "Produits en vedette", de: "Ausgewählte Produkte" },
      subtitle: { en: "A snapshot of our ready-to-use formulations.", zh: "即用型配方精选。", ja: "即使用処方の一部をご紹介します。", ko: "바로 사용 가능한 제형을 엄선하여 소개합니다.", es: "Una muestra de nuestras formulaciones listas para usar.", fr: "Un aperçu de nos formulations prêtes à l'emploi.", de: "Ein Auszug unserer gebrauchsfertigen Formulierungen." },
      allCta: { en: "View all", zh: "查看全部", ja: "すべて見る", ko: "전체 보기", es: "Ver todo", fr: "Tout voir", de: "Alle ansehen" },
    },
    articles: {
      title: { en: "Latest Articles", zh: "最新文章", ja: "最新記事", ko: "최근 기사", es: "Últimos artículos", fr: "Derniers articles", de: "Neueste Artikel" },
      allCta: { en: "Read more", zh: "阅读更多", ja: "もっと読む", ko: "더 보기", es: "Leer más", fr: "Lire plus", de: "Mehr lesen" },
    },
    aestheticsLink: {
      prompt: { en: "Curious about the colors themselves?", zh: "对色彩本身感兴趣？", ja: "色そのものに興味がありますか？", ko: "색 자체에 관심이 있으신가요?", es: "¿Te interesan los colores en sí?", fr: "Intéressé(e) par les couleurs elles-mêmes ?", de: "Interesse an den Farben selbst?" },
      cta: { en: "Visit Color Aesthetics", zh: "进入色彩美学", ja: "色彩美学を見る", ko: "컬러 미학 보기", es: "Ver estética del color", fr: "Voir l'esthétique des couleurs", de: "Farbästhetik entdecken" },
    },
    quicklinks: {
      products: { en: "Products", zh: "产品", ja: "製品", ko: "제품", es: "Productos", fr: "Produits", de: "Produkte" },
      articles: { en: "Articles", zh: "文章", ja: "記事", ko: "기사", es: "Artículos", fr: "Articles", de: "Artikel" },
    },
  },
  products: {
    empty: { en: "No products yet.", zh: "暂无产品。", ja: "製品はまだありません。", ko: "제품이 아직 없습니다.", es: "Aún no hay productos.", fr: "Aucun produit pour le moment.", de: "Noch keine Produkte." },
    inquire: { en: "Request Quote", zh: "询价", ja: "見積もりを依頼", ko: "견적 요청", es: "Solicitar cotización", fr: "Demander un devis", de: "Angebot anfordern" },
    applications: { en: "Applications", zh: "应用领域", ja: "用途", ko: "용도", es: "Aplicaciones", fr: "Applications", de: "Anwendungen" },
    backToList: { en: "Back to products", zh: "返回产品列表", ja: "製品一覧へ戻る", ko: "제품 목록으로", es: "Volver a productos", fr: "Retour aux produits", de: "Zurück zu Produkten" },
    breadcrumbHome: { en: "Home", zh: "首页", ja: "ホーム", ko: "홈", es: "Inicio", fr: "Accueil", de: "Start" },
  },
  articles: {
    title: { en: "Articles & Insights", zh: "文章与洞察", ja: "記事・洞察", ko: "기사 & 인사이트", es: "Artículos e ideas", fr: "Articles et perspectives", de: "Artikel & Einblicke" },
    subtitle: { en: "Industry insights, regulatory updates, and color science from our team.", zh: "行业洞察、法规更新和色彩科学。", ja: "業界の洞察、規制更新、色彩科学。", ko: "산업 인사이트, 규제 업데이트, 컬러 과학.", es: "Perspectivas del sector, actualizaciones regulatorias y ciencia del color.", fr: "Tendances sectorielles, mises à jour réglementaires et science des couleurs.", de: "Branchen-Insights, regulatorische Updates und Farbwissenschaft." },
    empty: { en: "No articles yet.", zh: "暂无文章。", ja: "記事はまだありません。", ko: "기사가 아직 없습니다.", es: "Aún no hay artículos.", fr: "Aucun article pour le moment.", de: "Noch keine Artikel." },
    backToList: { en: "Back to articles", zh: "返回文章列表", ja: "記事一覧へ戻る", ko: "기사 목록으로", es: "Volver a artículos", fr: "Retour aux articles", de: "Zurück zu Artikeln" },
    breadcrumbHome: { en: "Home", zh: "首页", ja: "ホーム", ko: "홈", es: "Inicio", fr: "Accueil", de: "Start" },
  },
  footer: {
    articles: { en: "Articles", zh: "文章", ja: "記事", ko: "기사", es: "Artículos", fr: "Articles", de: "Artikel" },
    aesthetics: { en: "Color Aesthetics", zh: "色彩美学", ja: "色彩美学", ko: "컬러 미학", es: "Estética del color", fr: "Esthétique des couleurs", de: "Farbästhetik" },
    aestheticsOverview: { en: "Overview", zh: "总览", ja: "概要", ko: "개요", es: "Resumen", fr: "Aperçu", de: "Übersicht" },
    aestheticsStories: { en: "Color stories", zh: "色彩故事", ja: "色彩ストーリー", ko: "컬러 스토리", es: "Historias del color", fr: "Histoires de couleurs", de: "Farbgeschichten" },
    aestheticsScience: { en: "Science", zh: "色彩科学", ja: "色彩科学", ko: "컬러 과학", es: "Ciencia del color", fr: "Science des couleurs", de: "Farbwissenschaft" },
    aestheticsGallery: { en: "Gallery", zh: "美学图库", ja: "美学ギャラリー", ko: "미학 갤러리", es: "Galería estética", fr: "Galerie esthétique", de: "Ästhetik-Galerie" },
  },
};

const LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"];

function pick(map, locale) {
  return map[locale] || map.en;
}

function deepClean(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key]
        .replace(/B 端/g, "企业")
        .replace(/B端/g, "企业")
        .replace(/C 端/g, "色彩美学")
        .replace(/C端/g, "色彩美学")
        .replace(/B2B/g, "企业")
        .replace(/C2C/g, "色彩美学")
        .replace(/b2b/g, "b2b")
        .replace(/c2c/g, "c2c");
    } else {
      deepClean(obj[key]);
    }
  }
}

for (const locale of LOCALES) {
  const file = path.join(MESSAGES_DIR, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  data.nav = data.nav || {};
  delete data.nav.b2b;
  delete data.nav.c2c;
  data.nav.articles = pick(LOCALE_DEFAULTS.nav.articles, locale);

  data.home = data.home || {};
  data.home.hero = data.home.hero || {};
  delete data.home.hero.zones;
  delete data.home.hero.cta;
  data.home.hero.eyebrow = pick(LOCALE_DEFAULTS.home.heroEyebrow, locale);
  data.home.hero.primaryCta = pick(LOCALE_DEFAULTS.home.primaryCta, locale);
  data.home.hero.secondaryCta = pick(LOCALE_DEFAULTS.home.secondaryCta, locale);

  data.home.featuredProducts = {
    title: pick(LOCALE_DEFAULTS.home.featuredProducts.title, locale),
    subtitle: pick(LOCALE_DEFAULTS.home.featuredProducts.subtitle, locale),
    allCta: pick(LOCALE_DEFAULTS.home.featuredProducts.allCta, locale),
  };
  data.home.articles = {
    title: pick(LOCALE_DEFAULTS.home.articles.title, locale),
    allCta: pick(LOCALE_DEFAULTS.home.articles.allCta, locale),
  };
  data.home.aestheticsLink = {
    prompt: pick(LOCALE_DEFAULTS.home.aestheticsLink.prompt, locale),
    cta: pick(LOCALE_DEFAULTS.home.aestheticsLink.cta, locale),
  };
  data.home.quicklinks = data.home.quicklinks || {};
  data.home.quicklinks.products = pick(LOCALE_DEFAULTS.home.quicklinks.products, locale);
  data.home.quicklinks.articles = pick(LOCALE_DEFAULTS.home.quicklinks.articles, locale);

  data.products = data.products || {};
  data.products.empty = pick(LOCALE_DEFAULTS.products.empty, locale);
  data.products.inquire = pick(LOCALE_DEFAULTS.products.inquire, locale);
  data.products.applications = pick(LOCALE_DEFAULTS.products.applications, locale);
  data.products.backToList = pick(LOCALE_DEFAULTS.products.backToList, locale);
  data.products.breadcrumbHome = pick(LOCALE_DEFAULTS.products.breadcrumbHome, locale);

  data.articles = {
    title: pick(LOCALE_DEFAULTS.articles.title, locale),
    subtitle: pick(LOCALE_DEFAULTS.articles.subtitle, locale),
    empty: pick(LOCALE_DEFAULTS.articles.empty, locale),
    backToList: pick(LOCALE_DEFAULTS.articles.backToList, locale),
    breadcrumbHome: pick(LOCALE_DEFAULTS.articles.breadcrumbHome, locale),
  };

  data.footer = data.footer || {};
  for (const k of Object.keys(data.footer)) {
    if (k.startsWith("b2b") || k === "b2b" || k === "c2c" || k.startsWith("c2c")) {
      delete data.footer[k];
    }
  }
  delete data.footer.technicalResources;
  data.footer.articles = pick(LOCALE_DEFAULTS.footer.articles, locale);
  data.footer.aesthetics = pick(LOCALE_DEFAULTS.footer.aesthetics, locale);
  data.footer.aestheticsOverview = pick(LOCALE_DEFAULTS.footer.aestheticsOverview, locale);
  data.footer.aestheticsStories = pick(LOCALE_DEFAULTS.footer.aestheticsStories, locale);
  data.footer.aestheticsScience = pick(LOCALE_DEFAULTS.footer.aestheticsScience, locale);
  data.footer.aestheticsGallery = pick(LOCALE_DEFAULTS.footer.aestheticsGallery, locale);

  if (data.c2c) {
    const titleMap = { en: "Color Aesthetics", zh: "色彩美学", ja: "色彩美学", ko: "컬러 미학", es: "Estética del color", fr: "Esthétique des couleurs", de: "Farbästhetik" };
    data.c2c.title = titleMap[locale] || "Color Aesthetics";
    data.c2c.metaTitle = `${titleMap[locale] || "Color Aesthetics"} | EarthHue`;
    data.c2c.eyebrow = "";
    delete data.c2c.sectionTitle;
    if (typeof data.c2c.crossLinkPrompt === "string") {
      const map = {
        en: "Working on a commercial formulation? See specs, samples, and certifications.",
        zh: "在做商业配方？查看规格、样品和认证。",
        ja: "商業処方に取り組んでいますか？仕様・サンプル・認証をご覧ください。",
        ko: "상업용 제형을 작업 중이신가요? 사양, 샘플, 인증을 확인하세요.",
        es: "¿Trabajando en una formulación comercial? Consulta especificaciones, muestras y certificaciones.",
        fr: "Vous travaillez sur une formulation commerciale ? Consultez spécifications, échantillons et certifications.",
        de: "Arbeiten Sie an einer kommerziellen Formulierung? Spezifikationen, Muster und Zertifizierungen.",
      };
      data.c2c.crossLinkPrompt = map[locale] || map.en;
    }
    const ctaMap = { en: "View products", zh: "查看产品", ja: "製品を見る", ko: "제품 보기", es: "Ver productos", fr: "Voir les produits", de: "Produkte ansehen" };
    if (data.c2c.crossLinkCta) data.c2c.crossLinkCta = ctaMap[locale] || "View products";
    deepClean(data.c2c);
  }

  if (data.b2b) {
    const eyebrowMap = { en: "Enterprise & Formulators", zh: "企业与配方师", ja: "企業・処方者", ko: "기업 및 제형가", es: "Empresas y formuladores", fr: "Entreprises et formulateurs", de: "Unternehmen und Formulierer" };
    const titleMap = { en: "Get in touch", zh: "联系我们", ja: "お問い合わせ", ko: "문의하기", es: "Contacto", fr: "Contact", de: "Kontakt" };
    const metaTitleMap = { en: "Contact | EarthHue", zh: "联系我们 | EarthHue", ja: "お問い合わせ | EarthHue", ko: "문의하기 | EarthHue", es: "Contacto | EarthHue", fr: "Contact | EarthHue", de: "Kontakt | EarthHue" };
    data.b2b.eyebrow = eyebrowMap[locale] || eyebrowMap.en;
    delete data.b2b.sectionTitle;
    if (data.b2b.contact) {
      data.b2b.contact.title = titleMap[locale] || titleMap.en;
      data.b2b.contact.metaTitle = metaTitleMap[locale] || metaTitleMap.en;
      if (data.b2b.modules && data.b2b.modules.contact) {
        data.b2b.modules.contact.title = titleMap[locale] || titleMap.en;
      }
      const descMap = {
        en: "Reach our team for quotes, samples, partnership and factory visits.",
        zh: "联系我们的团队获取报价、样品、合作与参观预约。",
        ja: "見積もり、サンプル、合作、工場見学についてお問い合わせください。",
        ko: "견적, 샘플, 파트너십 및 공장 방문을 위해 팀에 연락하세요.",
        es: "Contacta con nuestro equipo para cotizaciones, muestras, alianzas y visitas a fábrica.",
        fr: "Contactez notre équipe pour devis, échantillons, partenariats et visites d'usine.",
        de: "Kontaktieren Sie unser Team für Angebote, Muster, Partnerschaft und Werksbesuche.",
      };
      data.b2b.contact.metaDescription = descMap[locale] || descMap.en;
    }
    deepClean(data.b2b);
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Updated ${locale}.json`);
}