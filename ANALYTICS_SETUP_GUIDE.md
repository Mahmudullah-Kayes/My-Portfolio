# Google Analytics and Search Console Setup Guide

This guide will walk you through setting up Google Analytics and Google Search Console for your portfolio website.

## Google Analytics Setup

### Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Set up for free"
3. Fill in your account details and click "Next"
4. Create a property:
   - Enter your property name (e.g., "Kayes Portfolio")
   - Select your time zone and currency
   - Click "Next"
5. Fill in your business information and click "Create"

### Step 2: Set Up a Data Stream

1. In your Google Analytics property, go to "Admin" > "Data Streams" > "Web"
2. Click "Add stream" and enter your website URL
3. Enter your website name and click "Create stream"
4. You'll receive a Measurement ID that looks like `G-XXXXXXXXXX`

### Step 3: Add Measurement ID to Your Project

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following line:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

### Step 4: Deploy Your Website

1. Commit your changes and push to your repository
2. Deploy your website on Vercel
3. Verify that Google Analytics is working by visiting your website and checking the "Realtime" report in Google Analytics

## Google Search Console Setup

### Step 1: Add Your Property to Search Console

1. Go to [Google Search Console](https://search.console.google.com/)
2. Click "Add property"
3. Choose "URL prefix" and enter your website URL
4. Click "Continue"

### Step 2: Verify Ownership

There are several verification methods. The easiest for a Next.js site is:

#### HTML Tag Verification

1. Select "HTML tag" verification method
2. Copy the meta tag content (it looks like a long string)
3. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
   ```
4. Deploy your website
5. Go back to Search Console and click "Verify"

### Step 3: Submit Your Sitemap

1. Create a sitemap.xml file (if you don't have one already)
2. In Search Console, go to "Sitemaps"
3. Enter the URL of your sitemap (usually `https://yourdomain.com/sitemap.xml`)
4. Click "Submit"

## Creating a Sitemap

To help Google index your site better, create a sitemap:

1. Create a file at `web-dashboard/src/app/sitemap.ts` with the following content:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Add more URLs as needed
  ];
}
```

Replace `your-domain.com` with your actual domain.

## Creating a robots.txt File

Create a file at `web-dashboard/src/app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', // Prevent indexing of admin areas
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  };
}
```

Replace `your-domain.com` with your actual domain.

## Monitoring Performance

1. **Google Analytics**: Check the "Realtime" and "Acquisition" reports to monitor traffic
2. **Search Console**: Monitor your website's performance in search results, including:
   - Search queries that bring users to your site
   - Click-through rates
   - Position in search results
   - Mobile usability issues
   - Core Web Vitals

Remember to check both tools regularly to optimize your website's performance and visibility. 