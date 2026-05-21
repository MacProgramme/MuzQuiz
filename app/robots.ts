import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/profile',
          '/room/',
          '/j/',
          '/u/',
          '/redeem',
          '/auth/',
          '/maintenance',
        ],
      },
    ],
    sitemap: 'https://www.muzquiz.fr/sitemap.xml',
    host: 'https://www