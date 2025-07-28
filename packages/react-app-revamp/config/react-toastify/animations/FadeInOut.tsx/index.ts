import { cssTransition } from "react-toastify";

export const fadeInOut = cssTransition({
  enter: "animate-fade-in",
  exit: "animate-fade-out",
  collapse: false,
});
