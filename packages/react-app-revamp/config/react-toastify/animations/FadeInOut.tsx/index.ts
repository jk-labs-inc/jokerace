import { cssTransition } from "react-toastify";

export const fadeInOut = cssTransition({
  enter: "fadeIn",
  exit: "fadeOut",
  collapse: false,
});
