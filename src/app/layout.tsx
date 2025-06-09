// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {

  title: {
    default: "Mario's Network Conversion Toolkit",
    template: "%s | Mario's Network Toolkit", 
  },

  description: "One more online toolkit for network calculations: CIDR, Bandwidth, Binary conversions, and more. Simple, fast, and accurate networking tools for everyone.",
 
  keywords: ["network calculator", "CIDR", "bandwidth", "binary converter", "IP subnet", "networking tools", "online tools", "network utilities"],
 
  alternates: {
    canonical: 'https://calculators.mariospavlou.net',
  },
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Mario's Network Conversion Toolkit",
    description: "Your ultimate online toolkit for network calculations: CIDR, Bandwidth, Binary conversions, and more. Simple, fast, and accurate networking tools for everyone.",
    url: 'https://calculators.mariospavlou.net',
    siteName: "Mario's Network Toolkit"
  },

  robots: {
    index: true, // Allow indexing of this page
    follow: true, // Allow following links from this page
    nocache: false, // Don't prevent caching
    googleBot: { // Specific rules for Googlebot
      index: true,
      follow: true,
      noimageindex: false, // Allow image indexing
      'max-video-preview': -1, // No limit on video preview length
      'max-snippet': -1, // No limit on text snippet length
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}