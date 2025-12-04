import LandingPage from "@components/_pages/Landing/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <LandingPage />;
}
