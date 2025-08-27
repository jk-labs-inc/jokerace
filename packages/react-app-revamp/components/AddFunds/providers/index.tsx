import { FC } from "react";
import AddFundsJumperProvider from "./bridges/jumper";

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
  const getProviders = () => {
    switch (type) {
      case AddFundsProviderType.ONRAMP:
        return [];
      case AddFundsProviderType.BRIDGE:
        return [<AddFundsJumperProvider key="jumper" chain={chain} asset={asset} />];
      default:
        return [];
    }
  };

  const providers = getProviders();

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-neutral-11 text-[16px]">
        fund from another chain into {asset} on {chain}.
      </p>
      {providers}
    </div>
  );
};

export default AddFundsProviders;
