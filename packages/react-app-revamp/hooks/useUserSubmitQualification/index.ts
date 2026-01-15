import { useWallet } from "@getpara/react-sdk-lite";
import { useSubmitQualification } from "./useSubmitQualification";
import { useConnection } from "wagmi";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const { address: userAddress } = useConnection();

  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(userAddress as `0x${string}`);

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
}

export default useUser;
