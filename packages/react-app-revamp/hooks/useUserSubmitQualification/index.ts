import { useAccount } from "wagmi";
import { useSubmitQualification } from "./useSubmitQualification";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const { address: userAddress } = useAccount();
  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(userAddress);

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
}

export default useUser;
