import { createFileRoute, Outlet } from "@tanstack/react-router";
import LayoutContests from "@layouts/LayoutContests";

export const Route = createFileRoute("/contests")({
  component: ContestsLayout,
});

function ContestsLayout() {
  return (
    <LayoutContests>
      <Outlet />
    </LayoutContests>
  );
}

