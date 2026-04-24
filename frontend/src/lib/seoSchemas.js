import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from '@/lib/siteConfig';

/** JSON-LD: organização + website (página inicial) */
export function organizationAndWebsiteSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pt-BR',
    },
  ];
}

/** JSON-LD: listagem do blog */
export function blogListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/blog#webpage`,
    name: 'Blog Emplyon',
    description:
      'Artigos sobre escalas de trabalho, conformidade, liderança operacional e gestão de equipas.',
    url: `${SITE_URL}/blog`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'pt-BR',
  };
}
