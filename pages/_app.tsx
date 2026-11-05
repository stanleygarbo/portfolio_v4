import type { AppProps } from "next/app";
import Script from "next/script";
import Layout from "../components/Layout";
import AllContextProvider from "../contexts/AllContextProvider";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AllContextProvider pageTheme={pageProps.theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
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
    </AllContextProvider>
  );
}

export default MyApp;
