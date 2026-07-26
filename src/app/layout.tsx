import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Outfit } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SystemProvider } from "@/components/providers/SystemProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { logger } from '../lib/logger';

export async function generateMetadata(): Promise<Metadata> {
  let dynamicTitle = "Fábrica de Cobertores y Tilmas | Venta por Mayoreo | MANO FIL";
  let dynamicDescription = "Fábrica textil de cobertores y tilmas por mayoreo en México. Suministro industrial B2B y logística a gran escala.";
  let dynamicKeywords = ["cobertores gruesos", "cobertores para invierno", "cobertores ultra cálidos", "venta de cobertores por mayoreo", "cobertores matrimoniales", "cobertores king size", "MANO FIL Cobertores", "fábrica textil Tlaxcala", "Mano Fil S.A."];

  try {
    const settingsRef = doc(db, "system_settings", "global");
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.seoTitle) dynamicTitle = data.seoTitle;
      if (data.seoDescription) dynamicDescription = data.seoDescription;
      if (data.seoKeywords) {
        dynamicKeywords = data.seoKeywords.split(',').map((k: string) => k.trim());
      }
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
    keywords: dynamicKeywords,
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
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "MANO FIL Cobertores - Fabricantes de Cobertores por Mayoreo desde Tlaxcala",
        }
      ],
      locale: "es_MX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
      images: ["/og-image.png"],
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

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#070b14" />
        <meta name="google-site-verification" content="TU_CODIGO_DE_VERIFICACION_AQUI" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-300 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
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
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      // SW registered successfully
                    }).catch(function(err) {
                      // Silently catch registration failure
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
                "@type": ["ManufacturingBusiness", "WholesaleStore", "B2BBusiness"],
                "name": "Mano Fil S.A.",
                "image": "https://cobertores.com/logo-oficial.png",
                "@id": "https://cobertores.com",
                "url": "https://cobertores.com",
                "telephone": "+522464642891",
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
                "foundingDate": "1962",
                "description": "Fábrica textil de cobertores y tilmas por mayoreo en México. Calidad industrial B2B y suministro a gran escala."
              })
            }}
          />
          <SystemProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
            
            <div className="fixed bottom-6 left-6 z-50">
              <ThemeToggle />
            </div>
            
            <WhatsAppButton />
            <Toaster position="bottom-right" />
          </SystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
