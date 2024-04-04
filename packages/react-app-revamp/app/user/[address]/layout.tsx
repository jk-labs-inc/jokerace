import { getAddressProps } from "@helpers/getAddressProps";
import LayoutUser from "@layouts/LayoutUser";
import { notFound } from "next/navigation";
import React from "react";

const UserLayout = async ({ params, children }: { params: { address: string }; children: React.ReactNode }) => {
  const addressProps = await getAddressProps(params.address);

  if (addressProps.notFound) {
    return notFound();
  }

  return <LayoutUser address={addressProps.address ?? ""}>{children}</LayoutUser>;
};

export default UserLayout;
