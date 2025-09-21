import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Minister Internship Scheme - AI Recommendation Engine",
  description: "Find the perfect internship opportunities through AI-powered recommendations. Official PM Internship Scheme portal for connecting youth with top companies.",
  keywords: ["PM Internship Scheme", "internship", "AI", "recommendation", "career", "jobs", "government scheme", "youth employment"],
  authors: [{ name: "Ministry of Corporate Affairs, Government of India" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
