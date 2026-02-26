import type { Metadata } from "next";
import Script from "next/script";
import ThemeProvider from "@/components/ThemeProvider";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: "GangOfMusafirs – Curated Travel Experiences Across India",
    template: "%s | GangOfMusafirs",
  },
  description:
    "Explore India like never before with GangOfMusafirs. Curated group trips to Hill Stations, Beaches, Adventure & Cultural destinations. Book your next adventure today!",
  keywords:
    "group travel India, curated trips, travel agency, hill stations, beach trips, adventure travel, GangOfMusafirs, off the beaten path, Manali, Goa, Rishikesh, Rajasthan",
  metadataBase: new URL("https://gangofmusafirs.in"),
  openGraph: {
    title: "GangOfMusafirs – Curated Travel Experiences Across India",
    description:
      "Explore India like never before with GangOfMusafirs. Curated group trips to Hill Stations, Beaches, Adventure & Cultural destinations.",
    type: "website",
    siteName: "GangOfMusafirs",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GangOfMusafirs – Curated Travel Experiences",
    description:
      "Off-the-beaten-path group adventures across India. Expert-planned, stress-free travel.",
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gom-theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`
          }}
        />
      </body>
    </html>
  );
}
