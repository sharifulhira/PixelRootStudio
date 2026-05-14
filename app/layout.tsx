import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { FloatingNavigation } from "@/components/navigation/floating-navigation";
import { siteSeo } from "@/seo/site-seo";

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

export const metadata: Metadata = {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var n=(t==="light"||t==="dark")?t:(p?"dark":"light");document.documentElement.setAttribute("data-theme",n);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <div className="app-shell">
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="container footer-row">
              <p>{siteSeo.siteName}</p>
            </div>
          </footer>
          <FloatingNavigation />
        </div>
      </body>
    </html>
  );
}
