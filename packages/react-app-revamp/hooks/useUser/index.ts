import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ContractConfig } from "@hooks/useContest";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useAnyoneCanVote } from "./useAnyoneCanVote";
import { useSubmitQualification } from "./useSubmitQualification";
import { useVoteQualification } from "./useVoteQualification";
import { useVoteUpdates } from "./useVoteUpdates";

export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();
  const contestAddressLowerCase = address.toLowerCase();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === lowerCaseChainName,
  )?.[0]?.id;
  const { address: userAddress } = useAccount();

  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(
    userAddress,
    contestAddressLowerCase,
    lowerCaseChainName,
  );

  const { checkIfCurrentUserQualifyToVote, setUserVoteQualification } = useVoteQualification(
    userAddress,
    contestAddressLowerCase,
    lowerCaseChainName,
    address,
    chainId,
  );
  const { checkAnyoneCanVoteUserQualification } = useAnyoneCanVote(userAddress, address, chainId);
  const { updateCurrentUserVotes } = useVoteUpdates(userAddress, address);

  const wrappedCheckAnyoneCanVoteUserQualification = async (abi: any, version: string) => {
    await checkAnyoneCanVoteUserQualification(abi, version, setUserVoteQualification);
  };

  const wrappedCheckIfCurrentUserQualifyToVote = async (contractConfig: ContractConfig, version: string) => {
    await checkIfCurrentUserQualifyToVote(contractConfig, version, wrappedCheckAnyoneCanVoteUserQualification);
  };

  const wrappedUpdateCurrentUserVotes = async (abi: any, version: string, anyoneCanVote?: boolean) => {
    await updateCurrentUserVotes(abi, version, anyoneCanVote, wrappedCheckAnyoneCanVoteUserQualification);
  };

  return {
    checkIfCurrentUserQualifyToVote: wrappedCheckIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes: wrappedUpdateCurrentUserVotes,
  };
}

export default useUser;
