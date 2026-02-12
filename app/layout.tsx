import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "https://gijsroge.github.io/iconify-search-component/";

export const metadata: Metadata = {
  title: "Iconify Search",
  description:
    "Search and pick icons from Iconify in your React app. Ready-to-use component via shadcn or renderless primitive to build your own UI.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Iconify Search",
    description:
      "Search and pick icons from Iconify in your React app. Ready-to-use component via shadcn or renderless primitive to build your own UI.",
    type: "website",
    siteName: "Iconify Search",
    images: [
      {
        url: new URL("og-image.png", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "Iconify Search – search and pick icons from Iconify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iconify Search",
    description:
      "Search and pick icons from Iconify in your React app. Ready-to-use component via shadcn or renderless primitive.",
    images: [new URL("og-image.png", baseUrl).toString()],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
