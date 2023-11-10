import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import { BigNumber, utils } from "ethers";
import { readContracts } from "wagmi";

export const fetchProposalData = async (address: string, chainId: number, submission: string) => {
  const { abi } = await getContestContractVersion(address, chainId);
  const contracts = [
    {
      address,
      abi,
      chainId,
      functionName: "getProposal",
      args: [submission],
    },
    {
      address,
      abi,
      chainId,
      functionName: "proposalVotes",
      args: [submission],
    },
    {
      address,
      abi,
      chainId,
      functionName: "isProposalDeleted",
      args: [submission],
    },
  ];

  //@ts-ignore
  const results = (await readContracts({ contracts })) as any;
  const data = results[0].result;

  const isDeleted = results[2].result;

  const content = isDeleted ? "This proposal has been deleted by the creator" : data.description;
  const isContentImage = isUrlToImage(data.description);
  const forVotesBigInt = results[1].result[0] as bigint;
  const againstVotesBigInt = results[1].result[1] as bigint;
  const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
  const votes = Number(utils.formatEther(votesBigNumber));

  return {
    authorEthereumAddress: data.author,
    content: content,
    isContentImage,
    exists: data.exists,
    votes,
  };
};
