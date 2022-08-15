# JokeDAO Front-end
[![Vercel](./public/powered-by-vercel.svg)](https://vercel.com?utm_source=jokedao&utm_campaign=oss)

## Pre-requisites
- `yarn` installed
- `node` version >= `17.0.0`
- Have an Ethereum wallet (like MetaMask for instance)
## Before you start
- Install dependencies with `yarn install`
- Create a `.env` file and paste the following values:

```
NEXT_PUBLIC_INFURA_ID=
NEXT_PUBLIC_ETHERSCAN_KEY=
NEXT_PUBLIC_BLOCKNATIVE_DAPPID=
NEXT_PUBLIC_ALCHEMY_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built with
- NextJS
- Tailwind CSS & Headless-UI
- ethers, wagmi, @wagmi/core, @rainbow-me/rainbowkit
- zustand
- [Vercel](https://vercel.com/?utm_source=jokedao&utm_campaign=oss).

JokeDAO V2 front-end is hosted on [Vercel](https://vercel.com/?utm_source=jokedao&utm_campaign=oss).