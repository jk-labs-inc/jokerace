import { cssTransition } from "react-toastify";

export const fadeInOut = cssTransition({
  enter: "animate-fadeIn",
  exit: "animate-fadeOut",
  collapse: false,
});
