import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SwatchSnap — See Your Home in Any Color Instantly",
  description:
    "Upload a photo of your home, pick your Benjamin Moore colors, and preview the transformation before you commit. Free AI-powered house color visualizer.",
  keywords: [
    "house color visualizer",
    "Benjamin Moore",
    "exterior paint colors",
    "home color preview",
    "AI painting visualizer",
    "Buffalo NY painting",
  ],
  openGraph: {
    title: "SwatchSnap — See Your Home in Any Color Instantly",
    description:
      "Upload a photo, pick your Benjamin Moore colors, and preview the transformation before you commit.",
    url: "https://swatchsnap.com",
    siteName: "SwatchSnap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwatchSnap — AI House Color Visualizer",
    description:
      "See your home in any Benjamin Moore color before you paint. Free, instant, no sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
