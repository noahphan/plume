import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UIPreferencesProvider } from "@/lib/contexts/ui-preferences-context";
import { AuroraBackground } from "@/components/aurora-background";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Plume",
    template: "%s | Plume",
  },
  description: "Lightweight contract creation and e-signature platform",
  keywords: ["contracts", "e-signature", "documents", "signing"],
  authors: [{ name: "Plume" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Plume",
    title: "Plume - Contract Signing Made Beautiful",
    description: "Lightweight contract creation and e-signature platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plume",
    description: "Lightweight contract creation and e-signature platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <UIPreferencesProvider>
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="skip-to-content"
          >
            Skip to content
          </a>
          
          {/* Aurora gradient background */}
          <AuroraBackground />
          
          {/* Main content */}
          <main id="main-content">
            {children}
          </main>
        </UIPreferencesProvider>
      </body>
    </html>
  );
}
