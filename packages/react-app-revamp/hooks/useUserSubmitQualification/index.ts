import { useWallet } from "@getpara/react-sdk";
import { useSubmitQualification } from "./useSubmitQualification";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const { data: walletData } = useWallet();
  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(walletData?.address as `0x${string}`);

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
}

export default useUser;
