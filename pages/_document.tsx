import Document, {
  Head,
  Main,
  NextScript,
  Html,
  DocumentContext,
} from "next/document";

import { ServerStyleSheet } from "styled-components";
import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#333333" />
          <meta name="msapplication-navbutton-color" content="#333333" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="#333333"
          />
          <link rel="canonical" href="https://stanleygarbo.com/" />

          {process.env.NODE_ENV === "production" ? (
            <>
              <Script
                async
                defer
                data-website-id="e05b9f6c-66c6-4963-8497-24a5d0304bf2"
                src="https://umami-phi-teal.vercel.app/umami.js"
              ></Script>
              <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-WNJ3QRPKB0"
              ></Script>
              <Script id="gtag" defer src="/gtag.js"></Script>
            </>
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
