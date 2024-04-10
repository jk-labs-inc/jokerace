/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

type State = {
  count: number;
};

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    count: 0,
  },
  imageOptions: {
    format: "png",
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", c => {
  const { buttonValue, deriveState } = c;
  const state = deriveState(previousState => {
    if (buttonValue === "inc") previousState.count++;
    if (buttonValue === "dec") previousState.count--;
  });
  return c.res({
    image: <div style={{ color: "black", display: "flex", fontSize: 60 }}>Count: {state.count}</div>,
    intents: [<Button value="inc">Increment</Button>, <Button value="dec">Decrement</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
