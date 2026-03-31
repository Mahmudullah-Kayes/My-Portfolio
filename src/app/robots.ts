import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kayes-portfolio.vercel.app').replace(/\/$/, '');
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', // Prevent indexing of admin areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 