import { FC } from "react";
import { VotingQualifierType } from "../../types";
import VotingQualifierAllowlistedBalance from "./components/AllowlistedBalance";
import VotingQualifierAnyoneCanVoteBalance from "./components/AnyoneCanVoteBalance";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface VotingQualifierBalanceProps {
  type: VotingQualifierType;
}

const VotingQualifierBalance: FC<VotingQualifierBalanceProps> = ({ type }) => {
  const { address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!userAddress)
    return (
      <button
        className="w-32 md:w-48 h-8 text-[16px] font-bold bg-true-black text-neutral-11 rounded-[40px] border border-neutral-11 hover:bg-neutral-11 hover:text-true-black transition-all duration-300"
        onClick={openConnectModal}
      >
        connect wallet
      </button>
    );

  switch (type) {
    case VotingQualifierType.ANYONE_CAN_VOTE:
      return <VotingQualifierAnyoneCanVoteBalance userAddress={userAddress} />;
    case VotingQualifierType.ALLOWLISTED:
      return <VotingQualifierAllowlistedBalance userAddress={userAddress} />;
  }
};

export default VotingQualifierBalance;
