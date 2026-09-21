export interface Regulation {
  id: string;
  region: string;
  regionCode: "eu" | "us" | "japan" | "korea" | "china" | "asia";
  authority: string;
  description: string;
  standards: {
    code: string;
    title: string;
    description: string;
  }[];
  resources: {
    title: string;
    url: string;
  }[];
}

export const regulations: Regulation[] = [
  {
    id: "eu-food",
    region: "European Union",
    regionCode: "eu",
    authority: "EFSA / European Commission",
    description: "EU regulation on food additives, specifically colorants. All natural colors require EFSA safety assessment and approval.",
    standards: [
      { code: "Regulation (EC) No 1333/2008", title: "Food Additives", description: "Framework for approved food additives including colors" },
      { code: "Regulation (EC) No 1129/2011", title: "Annex II - Approved Colorants", description: "Positive list of permitted food colors" },
      { code: "Regulation (EC) No 231/2012", title: "Specifications", description: "Purity criteria for approved food additives" },
      { code: "Directive 2009/35/EC", title: "Colors in Cosmetics", description: "Approved colorants for cosmetic products" }
    ],
    resources: [
      { title: "EFSA Food Additives Database", url: "https://efsaopensource.eu/dataverse/aZ" },
      { title: "EU Food Additive Lists", url: "https://ec.europa.eu/food/food/food-law" }
    ]
  },
  {
    id: "us-fda",
    region: "United States",
    regionCode: "us",
    authority: "FDA - Food and Drug Administration",
    description: "FDA regulates colors under the Federal Food, Drug, and Cosmetic Act. Colors may be listed or subject to certification.",
    standards: [
      { code: "21 CFR Part 70", title: "Color Additives - General", description: "Overview of color additive regulations" },
      { code: "21 CFR Part 73", title: "Listed Colors", description: "Colors exempt from certification for food use" },
      { code: "21 CFR Part 74", title: "Certified Colors", description: "Colors required to undergo certification process" },
      { code: "GRAS", title: "Generally Recognized As Safe", description: "Self-affirmed or FDA-reviewed GRAS status" }
    ],
    resources: [
      { title: "FDA Color Additive Status List", url: "https://www.fda.gov/food/food-additives-petitions/color-additive-status-list" },
      { title: "GRAS Notices Inventory", url: "https://www.fda.gov/food/generally-recognized-safe-gras/gras-notice-inventory" }
    ]
  },
  {
    id: "japan",
    region: "Japan",
    regionCode: "japan",
    authority: "MHLW / JSFA",
    description: "Japan's Ministry of Health, Labour and Welfare regulates colors under the Food Sanitation Law.",
    standards: [
      { code: "JSFA IV", title: "Japan Specifications and Standards", description: "Specifications for food additives including colors" },
      { code: "MHLW Notification No. 307", title: "Approved Colors", description: "List of approved synthetic and natural colors" },
      { code: "Food Sanitation Law", title: "Safety Assessment", description: "Art. 13 - Standards for food additive use" }
    ],
    resources: [
      { title: "JSFA Official Website", url: "https://www.jsfa.or.jp" },
      { title: "MHLW Food Additives", url: "https://www.mhlw.go.jp" }
    ]
  },
  {
    id: "korea",
    region: "South Korea",
    regionCode: "korea",
    authority: "MFDS - Ministry of Food and Drug Safety",
    description: "Korea's MFDS maintains a positive list system for food colors under the Food Sanitation Act.",
    standards: [
      { code: "Food Sanitation Act", title: "Article 7", description: "Standards and specifications for food additives" },
      { code: "MFDS Notification", title: "Approved Color List", description: "Natural and synthetic colors permitted in food" },
      { code: "KFDA Standards", title: "Purity Criteria", description: "Specifications for individual color additives" }
    ],
    resources: [
      { title: "MFDS Food Additives", url: "https://www.mfds.go.kr" },
      { title: "e-Government Portal", url: "https://www.gov.kr" }
    ]
  },
  {
    id: "china",
    region: "China",
    regionCode: "china",
    authority: "NHFPC / NHC / SAMR",
    description: "China regulates colors as food添加剂 (additives) under national standards. Recent reforms consolidated authority under SAMR.",
    standards: [
      { code: "GB 2760", title: "Food Safety Standard", description: "Uses of food additives including colors" },
      { code: "GB 7912", title: "Food Grade Colors", description: "Specifications for permitted food colors" },
      { code: "SAMR Regulations", title: "Novel Food/Food Additive", description: "Approval process for new color additives" }
    ],
    resources: [
      { title: "National Health Commission", url: "http://www.nhc.gov.cn" },
      { title: "SAMR Standard Search", url: "https://samr.cfsa.net.cn" }
    ]
  },
  {
    id: "asean",
    region: "Southeast Asia",
    regionCode: "asia",
    authority: "ASEAN / National Authorities",
    description: "ASEAN harmonizes food additive regulations including colors. Individual countries maintain implementation authority.",
    standards: [
      { code: "ASEAN FHC", title: "Food Handling Committee", description: "Harmonized standards for food colors" },
      { code: "ANSCC", title: "ASEAN Food Regional Standards", description: "Technical requirements for food additives" },
      { code: "Country-specific", title: "National Implementation", description: "Thailand, Vietnam, Indonesia, Malaysia standards" }
    ],
    resources: [
      { title: "ASEAN Food Safety Board", url: "https://asean.org" },
      { title: "ASEAN Food Safety Knowledge Portal", url: "https://aseanfoodsafety.net" }
    ]
  }
];
