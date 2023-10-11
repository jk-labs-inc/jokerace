import { jokeraceTheme } from "@config/rainbowkit";
import { chains, config } from "@config/wagmi";
import LayoutBase from "@layouts/LayoutBase";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";
import { WagmiConfig } from "wagmi";
import PullToRefresh from "pulltorefreshjs";
import ReactDOMServer from "react-dom/server";
import { ArrowUpIcon, RefreshIcon } from "@heroicons/react/outline";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const title: string = pageProps.title ? `${pageProps.title}` : "jokerace";
  const description: string = pageProps.description
    ? pageProps.description
    : "jokerace - contests for communities to make, execute, and reward decisions.";

  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page: any) => <LayoutBase>{page}</LayoutBase>);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    if (!standalone) {
      return;
    }

    PullToRefresh.init({
      iconArrow: ReactDOMServer.renderToString(<ArrowUpIcon className="w-6 h-6 text-true-white animate-bounce" />),
      iconRefreshing: ReactDOMServer.renderToString(<RefreshIcon className="w-6 h-6 animate-spin  text-true-white" />),
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokerace.xyz/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} key="main" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content="https://jokerace.xyz/jokerace.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokerace_xyz" />
        <meta name="twitter:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:image" content="https://jokerace.xyz/jokerace.png" />
        <link rel="preload" href="/Sabo-Filled.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/Lato-Black.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/avalanche.png" as="image" />
        <link rel="preload" href="/harmony.png" as="image" />
        <link rel="preload" href="/fantom.png" as="image" />
        <link rel="preload" href="/gnosis.png" as="image" />
      </Head>

      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} theme={jokeraceTheme} modalSize="wide">
          <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>
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
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
