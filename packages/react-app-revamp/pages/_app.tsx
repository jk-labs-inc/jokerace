import { config } from "@config/wagmi";
import { Portal } from "@headlessui/react";
import LayoutBase from "@layouts/LayoutBase";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { polyfill } from "interweave-ssr";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Providers from "providers";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";
import { cookieToInitialState } from "wagmi";
import * as gtag from "../lib/gtag";
polyfill();

const isProd = process.env.NODE_ENV === "production";

type MyAppProps = AppProps & { cookie: string };

function MyApp({ Component, pageProps, cookie }: MyAppProps) {
  const router = useRouter();
  const title: string = pageProps.title ? `${pageProps.title}` : "JokeRace";
  const description: string = pageProps.description
    ? pageProps.description
    : "JokeRace - contests for communities to run, grow, and monetize.";

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page: any) => <LayoutBase>{page}</LayoutBase>);

  const initialState = cookieToInitialState(config, cookie);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (isProd) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokerace.io/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} key="main" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content="https://jokerace.io/jokerace.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokerace_io" />
        <meta name="twitter:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="twitter:image" content="https://jokerace.io/jokerace.jpg" />
        <link rel="preload" href="/Sabo-Filled.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Black.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/avalanche.png" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/harmony.png" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/fantom.svg" as="image" crossOrigin="anonymous" />
        <link rel="preload" href="/gnosis.png" as="image" crossOrigin="anonymous" />
      </Head>

      <Providers initialState={initialState}>
        {getLayout(<Component {...pageProps} />)}
        <Portal>
          <ToastContainer
            position="bottom-center"
            autoClose={4000}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            bodyClassName={() => "text-[16px] flex items-center"}
          />
        </Portal>
      </Providers>
    </>
  );
}

export default MyApp;

MyApp.getInitialProps = async (context: AppContext) => {
  const isServer = !!context.ctx.req;
  let cookie = "";

  if (isServer && context.ctx.req) {
    cookie = context.ctx.req.headers.cookie || "";
  }

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return { pageProps, cookie };
};
