import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { Charge } from "@hooks/useDeployContest/types";
import { type GetBalanceReturnType } from "@wagmi/core";
import { useRouter } from "next/router";
import { FC } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import ChargeLayoutSubmission from "./components/Submission";
import ChargeLayoutVote from "./components/Vote";

interface DialogModalSendProposalEntryChargeLayoutProps {
  charge: Charge;
  accountData: GetBalanceReturnType;
  type: "propose" | "vote";
  amountOfVotes?: number;
}

const ChargeLayout: FC<DialogModalSendProposalEntryChargeLayoutProps> = ({
  charge,
  accountData,
  type,
  amountOfVotes,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const asPath = router.asPath;
  const { chainName } = extractPathSegments(asPath);
  const chainUnitLabel = chains.find((c: { name: string }) => c.name === chainName)?.nativeCurrency.symbol;
  const chargeAmount = type === "propose" ? charge.type.costToPropose : charge.type.costToVote;
  const insufficientBalance = accountData.value < chargeAmount;
  const insufficientBalanceForVotes = accountData.value < chargeAmount * (amountOfVotes ?? 1);
  const entryChargeFormatted = formatEther(BigInt(chargeAmount));
  const entryChargeHalfFormatted = formatEther(BigInt(chargeAmount / 2));
  const commissionValue = charge.percentageToCreator > 0 ? entryChargeHalfFormatted : entryChargeFormatted;
  const accountBalance = formatEther(accountData.value);

  if (type === "propose") {
    return (
      <ChargeLayoutSubmission
        balance={accountBalance}
        commisionValue={commissionValue}
        entryChargeFormatted={entryChargeFormatted}
        insufficientBalance={insufficientBalance}
        nativeCurrencyLabel={chainUnitLabel ?? ""}
        nativeCurrencySymbol={accountData.symbol}
        percentageToCreator={charge.percentageToCreator}
        userAddress={address ?? ""}
      />
    );
  }

  return (
    <ChargeLayoutVote
      chargeType={charge.voteType}
      amountOfVotes={amountOfVotes}
      balance={accountBalance}
      entryChargeFormatted={entryChargeFormatted}
      insufficientBalance={insufficientBalanceForVotes}
      nativeCurrencySymbol={accountData.symbol}
      userAddress={address ?? ""}
    />
  );
};

export default ChargeLayout;
