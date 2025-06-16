import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace with your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', // Prevent indexing of admin areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 