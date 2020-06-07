import { AppProps } from "next/app";
import Head from "next/head";
import { Context as StyleContext } from "react-free-style";
import { baseUrl, siteName } from "../lib/config";
import { renderer } from "../style";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyleContext.Provider value={renderer}>
      <Head>
        <link
          rel="alternate"
          href={`${baseUrl}/rss.xml`}
          type="application/rss+xml"
          title={siteName}
        />
      </Head>
      <Component {...pageProps} />
    </StyleContext.Provider>
  );
}
