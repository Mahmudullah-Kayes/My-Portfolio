import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageViewTracker from "@/components/analytics/PageViewTracker";
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
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
