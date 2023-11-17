import Document, {
  Head,
  Main,
  NextScript,
  Html,
  DocumentContext,
} from "next/document";
import Script from "next/script";

import { ServerStyleSheet } from "styled-components";

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
          {process.env.NODE_ENV === "production" ? (
            <>
              <script
                async
                defer
                data-website-id="e05b9f6c-66c6-4963-8497-24a5d0304bf2"
                src="https://umami-phi-teal.vercel.app/umami.js"
              ></script>
              <Script
                async={true}
                src="https://www.googletagmanager.com/gtag/js?id=G-WNJ3QRPKB0"
              ></Script>
              <Script>
                {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-WNJ3QRPKB0');`}
              </Script>
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
