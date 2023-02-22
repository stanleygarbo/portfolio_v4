import type { AppProps } from "next/app";
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
    <AllContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AllContextProvider>
  );
}

export default MyApp;
