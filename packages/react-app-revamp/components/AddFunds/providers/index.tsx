import { FC } from "react";
import useAddFundsProviders from "./hooks/useAddFundsProviders";

export enum AddFundsProviderType {
  BRIDGE = "bridge",
  ONRAMP = "onramp",
}

interface AddFundsProvidersProps {
  type: AddFundsProviderType;
  chain: string;
  asset: string;
}

const AddFundsProviders: FC<AddFundsProvidersProps> = ({ type, chain, asset }) => {
  const providers = useAddFundsProviders({ type, chain, asset });

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-neutral-11 text-[16px]">
        fund from another chain into {asset} on {chain}.
      </p>
      {providers}
    </div>
  );
};

export default AddFundsProviders;
