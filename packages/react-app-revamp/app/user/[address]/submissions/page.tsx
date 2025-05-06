import UserListSkeleton from "@components/_pages/User/components/Skeleton";
import { getAddressProps } from "@helpers/getAddressProps";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import UserSubmissionsLayout from "./submissions";

type Props = {
  params: Promise<{ address: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const address = params.address;
  const addressProps = await getAddressProps(address);

  if (addressProps.notFound) {
    return notFound();
  }

  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserSubmissionsLayout address={addressProps.address ?? ""} />
    </Suspense>
  );
};

export default Page;
