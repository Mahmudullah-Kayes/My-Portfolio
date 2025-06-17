import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GADebugger from "@/components/analytics/GADebugger";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site URL for canonical URLs and social sharing
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kayes-portfolio.vercel.app/';

export const metadata: Metadata = {
  title: {
    default: "Kayes Portfolio | Full Stack Web Developer",
    template: "%s | Kayes Portfolio"
  },
  description: "Kayes's portfolio showcasing web development projects, skills, and professional experience in React, Next.js, and full-stack development.",
  keywords: ["web developer", "portfolio", "full stack", "react", "next.js", "javascript", "typescript"],
  authors: [{ name: "Kayes", url: siteUrl }],
  creator: "Kayes",
  publisher: "Kayes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  // Open Graph metadata
  openGraph: {
    title: "Kayes Portfolio | Full Stack Web Developer",
    description: "Kayes's portfolio showcasing web development projects, skills, and professional experience in React, Next.js, and full-stack development.",
    url: siteUrl,
    siteName: "Kayes Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`, // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Kayes Portfolio",
      },
    ],
  },
  // Twitter card metadata (still useful even without a Twitter account)
  twitter: {
    card: "summary_large_image",
    title: "Kayes Portfolio | Full Stack Web Developer",
    description: "Kayes's portfolio showcasing web development projects, skills, and professional experience in React, Next.js, and full-stack development.",
    images: [`${siteUrl}/og-image.png`],
  },
  // Icons and theme colors
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon1.png",
    apple: "/apple-icon.png",
    other: [
      {
        rel: "icon",
        url: "/icon0.svg",
        type: "image/svg+xml"
      },
      {
        rel: "manifest",
        url: "/manifest.json"
      }
    ],
  },
  manifest: "/manifest.json",
  verification: {
    // Add Google Search Console verification code here
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <PageViewTracker />
        {children}
        {/* Only shows in development mode */}
        <GADebugger />
      </body>
    </html>
  );
}
