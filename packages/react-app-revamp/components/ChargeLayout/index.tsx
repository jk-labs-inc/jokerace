import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { Charge } from "@hooks/useDeployContest/types";
import { type GetBalanceReturnType } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import ChargeLayoutSubmission from "./components/Submission";

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
  const { address } = useAccount();
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainUnitLabel = chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;
  const chargeAmount = type === "propose" ? charge.type.costToPropose : charge.type.costToVote;
  const insufficientBalance = accountData.value < chargeAmount;
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
        splitFeeDestination={charge.splitFeeDestination}
        userAddress={address ?? ""}
      />
    );
  }
};

export default ChargeLayout;
