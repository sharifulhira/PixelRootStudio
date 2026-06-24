import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSeo } from "@/seo/site-seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSeo = getSiteSeo();
  
  return {
    metadataBase: new URL(siteSeo.siteUrl),
    title: siteSeo.title,
    description: siteSeo.description,
    keywords: siteSeo.keywords,
    applicationName: siteSeo.siteName,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: siteSeo.locale,
      url: siteSeo.siteUrl,
      title: siteSeo.title,
      description: siteSeo.description,
      siteName: siteSeo.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteSeo.title,
      description: siteSeo.description,
      creator: siteSeo.twitterHandle,
      site: siteSeo.twitterHandle,
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
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var n=(t==="light"||t==="dark")?t:(p?"dark":"light");document.documentElement.setAttribute("data-theme",n);}catch(e){}})();`,
          }}
        />
        <AppShell footer={<SiteFooter />}>{children}</AppShell>
      </body>
    </html>
  );
}
