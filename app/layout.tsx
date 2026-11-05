import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import StyledComponentsRegistry from "../components/StyledComponentsRegistry";
import LoadingProvider from "../components/LoadingProvider";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stanleygarbo.com"),
  title: {
    default: "Stanley Garbo | A software developer's portfolio",
    template: "%s | Stanley Garbo | A developer's portfolio",
  },
  description:
    "Experienced in building, designing and scaling high quality web applications that utilize both web 2.0 and web 3.0 technologies.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    title: "Stanley Garbo | A Software Developer's portfolio",
    description:
      "Experienced in building, designing and scaling high quality web applications that utilize both web 2.0 and web 3.0 technologies.",
    images: ["/portfolio_.png"],
  },
  other: {
    "msapplication-navbutton-color": "#333333",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = { themeColor: "#333333" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <LoadingProvider>{children}</LoadingProvider>
        </StyledComponentsRegistry>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              data-website-id="e05b9f6c-66c6-4963-8497-24a5d0304bf2"
              src="https://umami-phi-teal.vercel.app/umami.js"
            />
            <Script src="https://www.googletagmanager.com/gtag/js?id=G-WNJ3QRPKB0" />
            <Script id="gtag" src="/gtag.js" />
          </>
        )}
      </body>
    </html>
  );
}
