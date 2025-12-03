import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { getAddressProps } from "@helpers/getAddressProps";
import LayoutUser from "@layouts/LayoutUser";

export const Route = createFileRoute("/user/$address")({
  loader: async ({ params }) => {
    const { address } = params;
    const addressProps = await getAddressProps(address);

    if (addressProps.notFound) {
      throw notFound();
    }

    return {
      address: addressProps.address ?? "",
      ensName: addressProps.ensName,
    };
  },
  component: UserLayout,
});

function UserLayout() {
  const { address } = Route.useLoaderData();

  return (
    <LayoutUser address={address}>
      <Outlet />
    </LayoutUser>
  );
}
