import UserListSkeleton from "@components/_pages/User/components/Skeleton";
import { getAddressProps } from "@helpers/getAddressProps";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const UserCommentsLayout = dynamic(() => import("./comments"), {
  loading: () => <UserListSkeleton />,
});

type Props = {
  params: { address: string };
};

const Page = async (props: Props) => {
  const address = props.params.address;
  const addressProps = await getAddressProps(address);

  if (addressProps.notFound) {
    return notFound();
  }

  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserCommentsLayout address={addressProps.address ?? ""} />
    </Suspense>
  );
};

export default Page;
