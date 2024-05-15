import { getAddressProps } from "@helpers/getAddressProps";
import { notFound } from "next/navigation";
import UserSubmissionsLayout from "./submissions";

type Props = {
  params: { address: string };
};

const Page = async (props: Props) => {
  const address = props.params.address;
  const addressProps = await getAddressProps(address);

  if (addressProps.notFound) {
    return notFound();
  }

  return <UserSubmissionsLayout address={addressProps.address ?? ""} />;
};

export default Page;
