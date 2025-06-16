import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kayes Portfolio",
  description: "Kayes's portfolio website showcasing professional work and skills",
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
      </body>
    </html>
  );
}
