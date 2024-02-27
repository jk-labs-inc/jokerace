import { jokeraceTheme } from "@config/rainbowkit";
import { chains, config } from "@config/wagmi";
import { Portal } from "@headlessui/react";
import LayoutBase from "@layouts/LayoutBase";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polyfill } from "interweave-ssr";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";
import { WagmiConfig } from "wagmi";
import * as gtag from "../lib/gtag";
polyfill();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const isProd = process.env.NODE_ENV === "production";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const title: string = pageProps.title ? `${pageProps.title}` : "JokeRace";
  const description: string = pageProps.description
    ? pageProps.description
    : "JokeRace - contests for communities to run, grow, and monetize.";

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page: any) => <LayoutBase>{page}</LayoutBase>);

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

      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} theme={jokeraceTheme} modalSize="wide">
          <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>
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
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
