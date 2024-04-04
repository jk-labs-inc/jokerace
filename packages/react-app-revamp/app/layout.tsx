import LayoutBase from "@layouts/LayoutBase";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";
import { polyfill } from "interweave-ssr";
import { GA_TRACKING_ID } from "lib/gtag";
import { headers } from "next/headers";
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";
import Portal from "./portal";
import Providers from "./providers";

polyfill();

export const metadata = {
  title: "JokeRace",
  description: "JokeRace - contests for communities to run, grow, and monetize.",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookie = headers().get("cookie") ?? "";

  return (
    <html lang="en">
      <body>
        <Providers cookie={cookie}>
          <LayoutBase>{children}</LayoutBase>
          <Portal />
          <GoogleAnalytics gaId={GA_TRACKING_ID} />
        </Providers>
      </body>
    </html>
  );
}
