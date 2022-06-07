import '@styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, client } from '@config/wagmi'
import { jokeDAOTheme } from '@config/rainbowkit'
import LayoutBase from '@layouts/LayoutBase'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import { toastOptions } from '@config/react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        /* @ts-ignore */
        theme={jokeDAOTheme}
      >
        <LayoutBase>
          <Component {...pageProps} />
        </LayoutBase>
        {/* @ts-ignore */}
        <Toaster position="bottom-right" toastOptions={toastOptions} />
      </RainbowKitProvider>
    </WagmiConfig>
  </>
}

export default MyApp
