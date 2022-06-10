import '@styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, client } from '@config/wagmi'
import { jokeDAOTheme } from '@config/rainbowkit'
import LayoutBase from '@layouts/LayoutBase'
import { Toaster } from 'react-hot-toast'
import { toastOptions } from '@config/react-hot-toast'
import Head from 'next/head'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  //@ts-ignore
  const getLayout = Component.getLayout ?? ((page: any) => <LayoutBase children={page} />)

  return <>
    <Head>
      <link rel="preload" href="/Lato-Regular.woff2" as="font" type="font/woff2"/>
      <link rel="preload" href="/Lato-Bold.woff2" as="font" type="font/woff2"/>
      <link rel="preload" href="/Lato-Black.woff2" as="font" type="font/woff2"/>
      <link rel="preload" href="/avalanche.png" as="image" /> 
      <link rel="preload" href="/harmony.png" as="image" /> 
      <link rel="preload" href="/fantom.png" as="image" /> 
      <link rel="preload" href="/gnosis.png" as="image" /> 
      <link rel="preload" href="/logo@desktop.png" as="image" /> 
      <link rel="preload" href="/logo@mobile.png" as="image" /> 
    </Head>
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        /* @ts-ignore */
        theme={jokeDAOTheme}
      >
        {getLayout(<Component {...pageProps} />)}

        {/* @ts-ignore */}
        <Toaster position="bottom-right" toastOptions={toastOptions} />
      </RainbowKitProvider>
    </WagmiConfig>
  </>
}

export default MyApp
