import { useWallet } from "@hooks/useWallet";
import { useSubmitQualification } from "./useSubmitQualification";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const { userAddress } = useWallet();

  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(userAddress as `0x${string}`);

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
}

export default useUser;
