import '@styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, client } from '@config/wagmi'
import { jokeDAOTheme } from '@config/rainbowkit'
import LayoutBase from '@layouts/LayoutBase'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={client}>
    <RainbowKitProvider
      chains={chains}
      theme={jokeDAOTheme}
    >
      <LayoutBase>
        <Component {...pageProps} />
      </LayoutBase>
    </RainbowKitProvider>
  </WagmiConfig>
}

export default MyApp
