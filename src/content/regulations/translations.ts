export type Locale = "en" | "zh" | "ja" | "ko" | "es" | "fr" | "de";

export interface RegulationTranslation {
  desc: string;
  standards_title: string;
  resources_title: string;
}

export const regulationTranslations: Record<string, Record<Locale, RegulationTranslation>> = {
  "eu": {
    "en": {
      "desc": "EU regulation on food additives, specifically colorants. All natural colors require EFSA safety assessment and approval.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "欧盟关于食品添加剂的法规，特别是着色剂。所有天然色素都需要EFSA的安全评估和批准。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "EUの食品添加物、特に着色料に関する規制。天然色はすべてEFSAの安全性評価と承認が必要。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "EU의 식품 첨가물, 특히 착색제에 대한 규정. 모든 천연 색소는 EFSA 안전성 평가와 승인이 필요.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "Regulación de la UE sobre aditivos alimentarios, específicamente colorantes. Los colores naturales requieren evaluación y aprobación de la EFSA.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "Réglementation de l'UE sur les additifs alimentaires, en particulier les colorants. Les couleurs naturelles nécessitent l'évaluation et l'approbation de l'EFSA.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "EU-Verordnung über Lebensmittelzusatzstoffe, insbesondere Farbstoffe. Alle natürlichen Farben erfordern EFSA-Sicherheitsbewertung und Genehmigung.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  },
  "us": {
    "en": {
      "desc": "FDA regulates colors under the Federal Food, Drug, and Cosmetic Act.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "FDA根据《联邦食品、药品和化妆品法案》监管色素。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "FDAは連邦食品、医薬品、化粧品法に基づき色素を規制。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "FDA는 연방 식품, 의약품, 화장품법에 따라 색소를 규제.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "La FDA regula los colores bajo la Ley Federal de Alimentos, Medicamentos y Cosméticos.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "La FDA réglemente les couleurs selon la Loi fédérale sur les aliments, médicaments et cosmétiques.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "Die FDA reguliert Farben nach dem Federal Food, Drug, and Cosmetic Act.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  },
  "japan": {
    "en": {
      "desc": "Japan's Ministry of Health, Labour and Welfare regulates colors under the Food Sanitation Law.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "日本厚生劳动省根据《食品卫生法》监管色素。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "日本の厚生労働省は食品衛生法に基づき色素を規制。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "일본 후생노동성은 식품위생법에 따라 색소를 규제.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "El Ministerio de Salud, Trabajo y Bienestar de Japón regula los colores bajo la Ley de Saneamiento de Alimentos.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "Le ministère japonais de la Santé, du Travail et des Affaires sociales réglemente les couleurs selon la Loi sur l'hygiène alimentaire.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "Japans Ministerium für Gesundheit, Arbeit und Soziales reguliert Farben nach dem Lebensmittelhygienegesetz.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  },
  "korea": {
    "en": {
      "desc": "South Korea's Ministry of Food and Drug Safety (MFDS) regulates food colorants.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "韩国食品医药品安全处（MFDS）监管食品着色剂。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "韓国の食品医薬品安全処（MFDS）が食品着色料を規制。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "한국 식품의약품안전처(MFDS)가 식품 착색제를 규제.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "El Ministerio de Seguridad Alimentaria y Farmacéutica de Corea (MFDS) regula los colorantes alimentarios.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "Le ministère coréen de la Sécurité alimentaire et pharmaceutique (MFDS) réglemente les colorants alimentaires.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "Südkoreas Ministerium für Lebensmittel- und Arzneimittelsicherheit (MFDS) reguliert Lebensmittelfarbstoffe.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  },
  "china": {
    "en": {
      "desc": "China's National Health Commission regulates food additives under GB standards.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "中国国家卫生健康委员会根据GB标准监管食品添加剂。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "中国の国家衛生健康委員会はGB基準に基づき食品添加物を規制。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "중국 국가보건위원회가 GB 기준에 따라 식품 첨가물을 규제.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "La Comisión Nacional de Salud de China regula los aditivos alimentarios bajo estándares GB.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "La Commission nationale de la santé de Chine réglemente les additifs alimentaires selon les normes GB.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "Chinas Nationaler Gesundheitskommission reguliert Lebensmittelzusatzstoffe nach GB-Standards.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  },
  "asean": {
    "en": {
      "desc": "ASEAN member states follow harmonized food additive standards through the ASEAN Consultative Committee on Standards and Quality.",
      "standards_title": "Standards & Regulations",
      "resources_title": "Official Resources"
    },
    "zh": {
      "desc": "东盟成员国通过东盟标准与质量协商委员会遵循统一的食品添加剂标准。",
      "standards_title": "标准与法规",
      "resources_title": "官方资源"
    },
    "ja": {
      "desc": "ASEAN加盟国はASEAN標準・品質協議会を通じて統一された食品添加物基準に従う。",
      "standards_title": "規格と規制",
      "resources_title": "公式リソース"
    },
    "ko": {
      "desc": "ASEAN 회원국은 ASEAN 표준·품질 자문위원회를 통해 통일된 식품 첨가물 기준을 따름.",
      "standards_title": "표준 및 규제",
      "resources_title": "공식 리소스"
    },
    "es": {
      "desc": "Los estados miembros de la ASEAN siguen estándares armonizados de aditivos alimentarios.",
      "standards_title": "Estándares y Regulaciones",
      "resources_title": "Recursos Oficiales"
    },
    "fr": {
      "desc": "Les États membres de l'ASEAN suivent des normes harmonisées pour les additifs alimentaires.",
      "standards_title": "Normes et Réglementations",
      "resources_title": "Ressources Officielles"
    },
    "de": {
      "desc": "Die ASEAN-Mitgliedstaaten befolgen harmonisierte Lebensmittelzusatzstoff-Standards.",
      "standards_title": "Standards & Vorschriften",
      "resources_title": "Offizielle Ressourcen"
    }
  }
};
