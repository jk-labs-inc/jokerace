import { useConnection } from "wagmi";
import { useSubmitQualification } from "./useSubmitQualification";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const { address: userAddress } = useConnection();
  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(userAddress);

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
}

export default useUser;
