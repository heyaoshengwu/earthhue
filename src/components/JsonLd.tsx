export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EarthHue",
    url: "https://earthhue.net",
    logo: "https://earthhue.net/logo.png",
    description: "Premium natural pigments and colorants for food, cosmetics, and pharmaceuticals.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@earthhue.net",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese", "Japanese", "Korean", "Spanish", "French", "German"],
    },
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://earthhue.net/{locale}/pigments?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  applications,
}: {
  name: string;
  description: string;
  applications: string[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: "EarthHue",
    },
    category: "Natural Pigments",
    additionalProperty: applications.map((app) => ({
      "@type": "PropertyValue",
      name: "Application",
      value: app,
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
