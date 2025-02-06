import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestType, ContestTypeConfig } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useAccount } from "wagmi";
import { useSubmissionMerkle } from "./useSubmissionMerkle";

const emptyVotingRequirements = {
  type: "erc20",
  nftType: "erc721",
  chain: "mainnet",
  tokenAddress: "",
  minTokensRequired: 0.01,
  powerType: "token",
  powerValue: 100,
  timestamp: Date.now(),
  name: "",
  symbol: "",
  logo: "",
  nftTokenId: "",
};

const useSetContestTypeConfig = () => {
  const { address } = useAccount();
  const {
    setPrompt,
    setSubmissionOpen,
    setVotingOpen,
    setVotingClose,
    setVotingAllowlist,
    setVotingMerkle,
    setVotingRequirements,
    setVotingRequirementsOption,
    setSubmissionMerkle,
  } = useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const { processCreatorAllowlist } = useSubmissionMerkle();

  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);

  const setContestTypeConfig = (type: ContestType, config: ContestTypeConfig) => {
    console.log("type", type);
    if (type === ContestType.VotingContest) {
      processCreatorAllowlist(address);
    } else {
      console.log("setting submission merkle to null");
      setSubmissionMerkle(null);
    }

    setPrompt(config.data.prompt);
    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
    setVotingAllowlist("csv", config.data.votingAllowlist.csv);
    setVotingAllowlist("prefilled", config.data.votingAllowlist.prefilled);
    setVotingMerkle("csv", config.data.votingMerkle.csv);
    setVotingMerkle("prefilled", config.data.votingMerkle.prefilled);
    setVotingRequirements(emptyVotingRequirements);
    setVotingRequirementsOption({
      value: "erc20",
      label: "token holders",
    });
  };

  return setContestTypeConfig;
};

export default useSetContestTypeConfig;
