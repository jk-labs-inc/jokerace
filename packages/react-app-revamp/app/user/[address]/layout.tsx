import { getAddressProps } from "@helpers/getAddressProps";
import LayoutUser from "@layouts/LayoutUser";
import { notFound } from "next/navigation";
import React from "react";

const UserLayout = async ({
  params,
  children,
}: {
  params: Promise<{ address: string }>;
  children: React.ReactNode;
}) => {
  const { address } = await params;
  const addressProps = await getAddressProps(address);

  if (addressProps.notFound) {
    return notFound();
  }

  return <LayoutUser address={addressProps.address ?? ""}>{children}</LayoutUser>;
};

export default UserLayout;
