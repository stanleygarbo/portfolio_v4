import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import AllContextProvider from "../contexts/AllContextProvider";

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
