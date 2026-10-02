import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { logger } from '../lib/logger';

export async function generateMetadata(): Promise<Metadata> {
  let dynamicTitle = "Cobertores Ultra Cálidos para Invierno | MANO FIL Cobertores.com";
  let dynamicDescription = "Descubre la colección de cobertores MANO FIL: gruesos, pachoncitos y con diseños exclusivos para conservar el calor. Calidad premium en cobertores ligeros, de invierno, matrimoniales y king size.";

  try {
    const settingsRef = doc(db, "system_settings", "global");
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.seoTitle) dynamicTitle = data.seoTitle;
      if (data.seoDescription) dynamicDescription = data.seoDescription;
    }
  } catch (error) {
    logger.error("Error fetching global SEO settings:", error);
  }

  return {
    title: {
      default: dynamicTitle,
      template: "%s | MANO FIL Cobertores.com"
    },
    description: dynamicDescription,
    keywords: [
      "cobertores gruesos",
      "cobertores para invierno",
      "cobertores ultra cálidos",
      "cobertores pachoncitos",
      "venta de cobertores por mayoreo",
      "cobertores matrimoniales",
      "cobertores king size",
      "cobertores de doble vista",
      "cobertores económicos",
      "cobertores México",
      "cobertores Tlaxcala",
      "fábrica de cobertores",
      "MANO FIL Cobertores",
      "Mano Fil S.A.",
      "fábrica textil Tlaxcala",
      "tilmas por mayoreo",
      "mantas térmicas industriales",
      "cobertores.com",
      "suministro textil México",
      "cobertores calidad industrial"
    ],
    authors: [{ name: "MANO FIL Cobertores" }],
    creator: "MANO FIL Cobertores",
    publisher: "MANO FIL Cobertores",
    metadataBase: new URL('https://cobertores.com'),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: "https://cobertores.com",
      siteName: "MANO FIL Cobertores",
      images: [
        {
          url: "/logo-oficial.png",
          width: 1200,
          height: 630,
          alt: "MANO FIL Cobertores - Ultra Suaves y Calientitos",
        }
      ],
      locale: "es_MX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
      images: ["/logo-oficial.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#070b14] text-slate-300`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#070b14" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px'
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#1e293b' } }
        }} />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NYXY4MK85C"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NYXY4MK85C', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Silenciar logs de consola en producción */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                console.log = function() {};
                console.info = function() {};
                console.debug = function() {};
              }
            `
          }}
        />
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.error('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `
          }}
        />
        {/* JSON-LD Schema para SEO Local y Corporativo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ManufacturingBusiness", "WholesaleStore"],
              "name": "Mano Fil S.A.",
              "alternateName": "MANO FIL Cobertores",
              "image": [
                "https://cobertores.com/logo-oficial.png",
                "https://cobertores.com/hero-bg.webp"
              ],
              "@id": "https://cobertores.com",
              "url": "https://cobertores.com",
              "telephone": "+522464642891",
              "email": "ventas@cobertores.com",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Calle El Grullo",
                "addressLocality": "Santa Ana Chiautempan",
                "addressRegion": "Tlaxcala",
                "postalCode": "90800",
                "addressCountry": "MX"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.3135,
                "longitude": -98.1969
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ],
              "foundingDate": "1962",
              "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 50 },
              "areaServed": {
                "@type": "Country",
                "name": "México"
              },
              "description": "Fábrica textil de cobertores y tilmas por mayoreo en México desde 1962. Suministro industrial B2B, cobertores para invierno ultra cálidos, matrimoniales, king size y tilmas económicas.",
              "sameAs": [
                "https://cobertores.com"
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
