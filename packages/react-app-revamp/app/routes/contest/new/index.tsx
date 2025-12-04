import { createFileRoute } from "@tanstack/react-router";
import CreateFlow from "@components/_pages/Create";

export const Route = createFileRoute("/contest/new/")({
  head: () => ({
    meta: [{ title: "Create a new contest - jokerace" }],
  }),
  component: NewContestPage,
});

function NewContestPage() {
  return <CreateFlow />;
}
