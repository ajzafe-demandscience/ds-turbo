import "@workspace/ui/globals.css";

import { SanityLive } from "@workspace/sanity/live";
import { Geist_Mono, Inter, Poppins } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { getNavigationData } from "@/lib/navigation";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  const nav = await getNavigationData();
  return (
    <html
      className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>
          <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />
          {children}
          <FooterServer />
          <SanityLive />
          <CombinedJsonLd includeOrganization includeWebsite />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
