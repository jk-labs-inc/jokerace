import dynamic from "next/dynamic";

export const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});
