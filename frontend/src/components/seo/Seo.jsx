import { Helmet } from 'react-helmet-async';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_KEYWORDS,
  absoluteUrl,
  canonicalUrl,
} from '@/lib/siteConfig';

/**
 * Meta tags e Open Graph / Twitter para cada rota pública.
 * @param {object} props
 * @param {string} props.title — Título completo da página (já com marca se desejar)
 * @param {string} props.description
 * @param {string} [props.path] — Caminho canónico, ex. `/blog` ou `/blog/slug`
 * @param {string} [props.image] — URL da imagem OG (relativa ou absoluta)
 * @param {'website'|'article'} [props.type]
 * @param {string} [props.keywords]
 * @param {boolean} [props.noindex]
 * @param {object} [props.article] — article:published_time, etc.
 * @param {object|object[]} [props.jsonLd] — Um ou mais objetos schema.org
 */
export function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  article,
  jsonLd,
}) {
  const url = canonicalUrl(path || '/');
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);

  const jsonBlocks = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean)
    : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="pt-BR" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}

      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="pt-BR" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {type === 'article' && article?.publishedTime ? (
        <meta property="article:published_time" content={article.publishedTime} />
      ) : null}
      {type === 'article' && article?.modifiedTime ? (
        <meta property="article:modified_time" content={article.modifiedTime} />
      ) : null}
      {type === 'article' && article?.section ? (
        <meta property="article:section" content={article.section} />
      ) : null}
      {type === 'article' && article?.author ? (
        <meta property="article:author" content={article.author} />
      ) : null}

      <meta name="theme-color" content="#1e3a5f" />

      {jsonBlocks.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
