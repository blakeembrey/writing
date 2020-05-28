import Head from "next/head";
import { AppProps } from "next/app";
import { Context, StyleSheetRenderer } from "react-free-style";
import { gaCode, baseUrl, siteName } from "../lib/config";

export default function App({ Component, pageProps }: AppProps) {
  const content =
    typeof window === "undefined" ? (
      <Component {...pageProps} />
    ) : (
      <Context.Provider value={new StyleSheetRenderer(true)}>
        <Component {...pageProps} />
      </Context.Provider>
    );

  return (
    <>
      <Head>
        <link
          rel="alternate"
          href={`${baseUrl}/rss.xml`}
          type="application/rss+xml"
          title={siteName}
        />
      </Head>
      {content}
      {gaCode ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', ${JSON.stringify(gaCode)}, 'auto');
          ga('send', 'pageview');`,
          }}
        />
      ) : undefined}
    </>
  );
}
