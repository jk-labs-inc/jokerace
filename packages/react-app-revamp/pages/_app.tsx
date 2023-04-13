import { jokeDAOTheme } from "@config/rainbowkit";
import { fadeInOut } from "@config/react-toastify/animations/FadeInOut.tsx";
import { chains, client } from "@config/wagmi";
import LayoutBase from "@layouts/LayoutBase";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loading-skeleton/dist/skeleton.css";

import { WagmiConfig } from "wagmi";

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
  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page: any) => <LayoutBase>{page}</LayoutBase>);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#ffef5c" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokedao.io/" />
        <meta property="og:title" content="JokeDAO 🃏 An open-source, collaborative decision-making platform." />
        <meta property="og:description" content="JokeDAO is an open-source, collaborative decision-making platform." />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content="https://jokedao.io/card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jokedao_" />
        <meta name="twitter:description" content="JokeDAO is an open-source, collaborative decision-making platform." />
        <meta name="twitter:image" content="https://jokedao.io/card.png" />
        <link rel="preload" href="/Sabo-Filled.otf" as="font" type="font/otf" />
        <link rel="preload" href="/Lato-Regular.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/Lato-Bold.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/Lato-Black.woff2" as="font" type="font/woff2" />
        <link rel="preload" href="/avalanche.png" as="image" />
        <link rel="preload" href="/harmony.png" as="image" />
        <link rel="preload" href="/fantom.png" as="image" />
        <link rel="preload" href="/gnosis.png" as="image" />
      </Head>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains} theme={jokeDAOTheme}>
          <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={fadeInOut}
            bodyClassName={() => "text-xs flex items-center"}
          />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
