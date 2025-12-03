import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";
import LayoutBase from "@layouts/LayoutBase";
import Providers from "../providers";
import Portal from "../portal";
//rm this
import { GA_TRACKING_ID } from "lib/gtag";
import "@getpara/react-sdk/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-tooltip/dist/react-tooltip.css";
import "simplebar-react/dist/simplebar.min.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "JokeRace" },
      {
        name: "description",
        content: "JokeRace - contests for communities to run, grow, and monetize.",
      },
      // Open Graph tags
      { property: "og:title", content: "JokeRace" },
      {
        property: "og:description",
        content: "JokeRace - contests for communities to run, grow, and monetize.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jokerace.io" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "https://jokerace.io/opengraph-image.jpg" },
      // Twitter tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@jokerace_io" },
      { name: "twitter:title", content: "JokeRace" },
      {
        name: "twitter:description",
        content: "JokeRace - contests for communities to run, grow, and monetize.",
      },
      { name: "twitter:image", content: "https://jokerace.io/twitter-image.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <body>
        <div id="__next">
          <Providers>
            <LayoutBase>
              <Outlet />
            </LayoutBase>
            <Portal />
            {/* TODO: add Google Analytics back */}
          </Providers>
        </div>
      </body>
    </html>
  );
}
