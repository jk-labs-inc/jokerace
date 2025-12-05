import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    // This helps modules determine the execution environment
    "process.browser": true,
  },
  ssr: {
    noExternal: ["react-tweet", "@rainbow-me/rainbowkit", "@mysten/dapp-kit"],
  },
  plugins: [
    tailwindcss(),
    nodePolyfills({
      exclude: ["constants"], // exclude to avoid conflict with local constants/ folder
    }),
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      srcDirectory: "app",
      router: {
        routesDirectory: "routes",
      },
    }),
    viteReact(),
    netlify(),
  ],
});
