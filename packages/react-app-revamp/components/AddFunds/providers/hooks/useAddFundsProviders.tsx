import { useMemo } from "react";
import AddFundsJumperProvider from "../bridges/jumper";
import { AddFundsProviderType } from "../index";

interface UseAddFundsProvidersParams {
  type: AddFundsProviderType;
  chain: string;
  asset: string;
}

const useAddFundsProviders = ({ type, chain, asset }: UseAddFundsProvidersParams) => {
  const providers = useMemo(() => {
    switch (type) {
      case AddFundsProviderType.ONRAMP:
        return [];
      case AddFundsProviderType.BRIDGE:
        return [<AddFundsJumperProvider key="jumper" chain={chain} asset={asset} />];
      default:
        return [];
    }
  }, [type, chain, asset]);

  return providers;
};

export default useAddFundsProviders;
