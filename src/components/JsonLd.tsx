export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EarthHue",
    url: "https://earthhue.net",
    logo: "https://earthhue.net/logo.png",
    description:
      "Manufacturer and supplier of fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin — for food, nutraceutical, cosmetic and pharmaceutical formulations.",
    foundingDate: "2019",
    sameAs: [
      "https://dev.to/@earthhue",
      "https://mastodon.social/@earthhue",
    ],
    knowsAbout: [
      "astaxanthin",
      "lutein",
      "lycopene",
      "beta-carotene",
      "zeaxanthin",
      "torularhodin",
      "natural carotenoids",
      "fermentation-derived pigments",
      "natural food colorants",
      "clean label colorants",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "tech@earthhue.net",
        contactType: "sales",
        areaServed: ["EU", "US", "JP", "KR", "CN", "SEA"],
        availableLanguage: ["English", "Chinese", "Japanese", "Korean", "Spanish", "French", "German"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EarthHue",
    url: "https://earthhue.net",
    description:
      "Fermentation-derived natural carotenoids and pigments for food, nutraceutical, cosmetic and pharmaceutical manufacturers.",
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "EarthHue",
      url: "https://earthhue.net",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export type ProductSpec = { label: string; value: string };

export function ProductJsonLd({
  name,
  description,
  applications,
  slug,
  locale = "en",
  specs,
  series,
  image,
}: {
  name: string;
  description: string;
  applications: string[];
  slug?: string;
  locale?: string;
  specs?: ProductSpec[];
  series?: string | null;
  image?: string | null;
}) {
  const url = slug ? `https://earthhue.net/${locale}/products/${slug}` : "https://earthhue.net";
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    sku: slug,
    mpn: slug,
    category: series === "fermentation" ? "Fermentation-Derived Natural Carotenoid" : "Natural Pigment",
    brand: {
      "@type": "Brand",
      name: "EarthHue",
    },
    manufacturer: {
      "@type": "Organization",
      name: "EarthHue",
      url: "https://earthhue.net",
    },
    additionalProperty: [
      ...applications.map((app) => ({
        "@type": "PropertyValue",
        name: "Application",
        value: app,
      })),
      ...(specs || []).map((s) => ({
        "@type": "PropertyValue",
        name: s.label,
        value: s.value,
      })),
    ],
  };
  if (image) {
    (jsonLd as Record<string, unknown>).image = image.startsWith("http")
      ? image
      : `https://earthhue.net${image}`;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  items,
  locale = "en",
}: {
  items: { q: string; a: string }[];
  locale?: string;
}) {
  if (!items || items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  locale = "en",
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  locale?: string;
  image?: string | null;
  datePublished?: string;
  dateModified?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://earthhue.net/${locale}/articles/${slug}`,
    },
    url: `https://earthhue.net/${locale}/articles/${slug}`,
    author: {
      "@type": "Organization",
      name: "EarthHue Technical Team",
      url: "https://earthhue.net",
    },
    publisher: {
      "@type": "Organization",
      name: "EarthHue",
      url: "https://earthhue.net",
      logo: {
        "@type": "ImageObject",
        url: "https://earthhue.net/logo.png",
      },
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(image
      ? {
          image: image.startsWith("http") ? image : `https://earthhue.net${image}`,
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ItemListJsonLd({
  items,
  name,
  locale = "en",
}: {
  items: { name: string; url: string }[];
  name: string;
  locale?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    inLanguage: locale,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function HowToJsonLd({
  name,
  description,
  steps,
  locale = "en",
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  locale?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    inLanguage: locale,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * The contact page is the entity anchor for the whole sales funnel: it states
 * who the company is, how to reach it, and which languages it answers in.
 */
export function ContactPageJsonLd({
  locale = "en",
  name,
  description,
  email,
  availableLanguages = [],
}: {
  locale?: string;
  name: string;
  description: string;
  email: string;
  availableLanguages?: string[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    description,
    url: `https://earthhue.net/${locale}/contact`,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      name: "EarthHue",
      url: "https://earthhue.net",
      email,
      logo: "https://earthhue.net/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        areaServed: ["EU", "US", "JP", "KR", "CN", "SEA"],
        ...(availableLanguages.length ? { availableLanguage: availableLanguages } : {}),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export type PigmentSchemaItem = {
  id: string;
  name: string;
  description: string;
  source: string;
  casNumber: string;
  einecsNumber: string;
  formulations: string[];
  category: string;
  regulations: { eu: string; us: string; japan: string; korea: string };
};

/**
 * The pigment catalogue is the most citable asset on the site: it answers
 * "which colorant is approved in which market" with an identifier, a source
 * and a named authority for every answer.
 */
export function PigmentCatalogJsonLd({
  locale = "en",
  name,
  pigments,
}: {
  locale?: string;
  name: string;
  pigments: PigmentSchemaItem[];
}) {
  const url = (id: string) => `https://earthhue.net/${locale}/pigments#${id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    inLanguage: locale,
    numberOfItems: pigments.length,
    itemListElement: pigments.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.name,
      url: url(p.id),
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        url: url(p.id),
        category: p.category,
        additionalProperty: [
          { "@type": "PropertyValue", name: "CAS Number", value: p.casNumber },
          { "@type": "PropertyValue", name: "EINECS Number", value: p.einecsNumber },
          { "@type": "PropertyValue", name: "Source", value: p.source },
          { "@type": "PropertyValue", name: "EU Regulation", value: p.regulations.eu },
          { "@type": "PropertyValue", name: "US Regulation", value: p.regulations.us },
          { "@type": "PropertyValue", name: "Japan Regulation", value: p.regulations.japan },
          { "@type": "PropertyValue", name: "Korea Regulation", value: p.regulations.korea },
          ...p.formulations.map((f) => ({
            "@type": "PropertyValue",
            name: "Formulation",
            value: f,
          })),
        ],
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export type RegulationSchemaItem = {
  id: string;
  region: string;
  regionCode: string;
  authority: string;
  description: string;
  standards: { code: string; title: string; description: string }[];
  resources: { title: string; url: string }[];
};

/**
 * Every regulatory market with the authority that governs it and the exact
 * instrument numbers, so an answer engine can cite the regulation itself
 * rather than a vague "approved in the EU".
 */
export function RegulationCatalogJsonLd({
  locale = "en",
  name,
  regulations,
}: {
  locale?: string;
  name: string;
  regulations: RegulationSchemaItem[];
}) {
  const url = (id: string) => `https://earthhue.net/${locale}/regulations#${id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    inLanguage: locale,
    numberOfItems: regulations.length,
    itemListElement: regulations.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: r.region,
      url: url(r.id),
      item: {
        "@type": "Organization",
        name: r.authority,
        description: r.description,
        url: url(r.id),
        additionalProperty: r.standards.map((s) => ({
          "@type": "PropertyValue",
          name: s.code,
          value: s.title,
          description: s.description,
        })),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
