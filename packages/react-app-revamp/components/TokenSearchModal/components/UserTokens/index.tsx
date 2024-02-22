import { chains } from "@config/wagmi";
import useFetchUserERC20Balances from "@hooks/useFetchUserErc20Balances";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useAccount } from "wagmi";

interface TokenSearchModalUserTokensProps {
  chainName: string;
}

const TokenSearchModalUserTokens: FC<TokenSearchModalUserTokensProps> = ({ chainName }) => {
  const { address } = useAccount();
  const { isLoading, balances } = useFetchUserERC20Balances(address ?? "", chainName);

  return <div></div>;
};

export default TokenSearchModalUserTokens;
