import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // TODO: add a not found component
    defaultNotFoundComponent: () => <div>Not Found</div>,
  });

  return router;
}
