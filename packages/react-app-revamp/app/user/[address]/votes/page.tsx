import { getAddressProps } from "@helpers/getAddressProps";
import { notFound } from "next/navigation";
import UserVotesLayout from "./votes";

type Props = {
  params: { address: string };
};

const Page = async (props: Props) => {
  const address = props.params.address;
  const addressProps = await getAddressProps(address);

  if (addressProps.notFound) {
    return notFound();
  }

  return <UserVotesLayout address={addressProps.address ?? ""} />;
};

export default Page;
