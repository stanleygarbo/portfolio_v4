import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import AllContextProvider from "../contexts/AllContextProvider";
import "@fontsource/poppins";
import "@fontsource/syne";
import "@fontsource/inter";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AllContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AllContextProvider>
  );
}

export default MyApp;
