import { getAddressProps } from "@helpers/getAddressProps";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import UserContests from "./contests";

type Props = {
  params: { address: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const address = params.address;

  const addressProps = await getAddressProps(address);

  return {
    title: addressProps.address
      ? `${addressProps.address} - jokerace`
        ? addressProps.ensName
        : ` ${addressProps.ensName} - jokerace`
      : "User not found",
  };
}

const Page = async (props: Props) => {
  const addressProps = await getAddressProps(props.params.address);

  if (addressProps.notFound) {
    return notFound();
  }

  return <UserContests address={addressProps.address ?? ""} />;
};

export default Page;
