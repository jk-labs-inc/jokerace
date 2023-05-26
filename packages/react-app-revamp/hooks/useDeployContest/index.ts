import { useContractFactoryStore } from "@hooks/useContractFactory";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import { ContractFactory } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { useDeployContestStore } from "./store";
import { differenceInSeconds, getUnixTime } from "date-fns";
import { waitForTransaction } from "@wagmi/core";
import { isSupabaseConfigured } from "@helpers/database";
import useV3ContestsIndex from "@hooks/useContestsIndexV3";

export function useDeployContest() {
  const { indexContestV3 } = useV3ContestsIndex();
  const stateContestDeployment = useContractFactoryStore(state => state);
  const {
    type,
    title,
    summary,
    prompt,
    submissionOpen,
    votingOpen,
    votingClose,
    votingMerkle,
    submissionMerkle,
    allowedSubmissionsPerUser,
    maxSubmissions,
    downvote,
    setDeployContestData,
    ...state
  } = useDeployContestStore(state => state);
  const { chain } = useNetwork();
  const { refetch } = useSigner();

  async function deployContest() {
    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setError(null);

    try {
      const signer = await refetch();
      const factoryCreateContest = new ContractFactory(
        DeployedContestContract.abi,
        DeployedContestContract.bytecode,
        //@ts-ignore
        signer.data,
      );

      const contestInfo = type + "|" + summary + "|" + prompt;

      // Handle allowedSubmissionsPerUser and maxSubmissions in case they are not set and we pass "infinity" to the contract
      const finalAllowedSubmissionsPerUser = !isNaN(allowedSubmissionsPerUser) ? allowedSubmissionsPerUser : 1000000;
      const finalMaxSubmissions = !isNaN(maxSubmissions) ? maxSubmissions : 1000000;

      const contestParameters = [
        getUnixTime(submissionOpen),
        // how many seconds will submissions be open
        differenceInSeconds(votingOpen, submissionOpen),
        // how many seconds will voting be open
        differenceInSeconds(votingClose, votingOpen),
        finalAllowedSubmissionsPerUser,
        finalMaxSubmissions,
        downvote ? 1 : 0,
      ];

      const contractContest = await factoryCreateContest.deploy(
        title,
        contestInfo,
        submissionMerkle
          ? submissionMerkle.merkleRoot
          : "0x0000000000000000000000000000000000000000000000000000000000000000",
        votingMerkle?.merkleRoot,
        contestParameters,
      );

      await contractContest.deployed();

      const receiptDeployContest = await waitForTransaction({
        chainId: chain?.id,
        hash: contractContest.deployTransaction.hash,
      });

      setDeployContestData(receiptDeployContest.transactionHash, contractContest.address);

      if (isSupabaseConfigured) {
        indexContestV3({
          title: title,
          info: contestInfo,
          datetimeOpeningSubmissions: submissionOpen,
          datetimeOpeningVoting: votingOpen,
          datetimeClosingVoting: votingClose,
          votingMerkleTree: votingMerkle,
          submissionMerkleTree: submissionMerkle,
          contractAddress: contractContest.address,
          authorAddress: (await signer.data?.getAddress()) ?? "",
          networkName: chain?.name.toLowerCase().replace(" ", "") ?? "",
        });
      }
    } catch (error) {
      console.error("Error: ", error); // Log all errors
    }
  }

  return {
    deployContest,
  };
}
