import { formatBalance } from "@helpers/formatBalance";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

interface UseUserNativeBalanceProps {
  address: `0x${string}`;
  chainId: number;
}

export const useUserNativeBalance = ({ address, chainId }: UseUserNativeBalanceProps) => {
  const { data, isLoading, error } = useBalance({
    address,
    chainId,
    query: {
      select(data) {
        const formattedToEther = formatEther(data.value ?? 0);

        return formatBalance(formattedToEther);
      },
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};
