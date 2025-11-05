import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { FC } from "react";
import ContestParamsChargeSubmission from "./components/Submission";
import ContestParamsChargeVote from "./components/Vote";

interface CreateContestChargeProps {
  chain: string;
  onError?: (value: boolean) => void;
}

const CreateContestCharge: FC<CreateContestChargeProps> = ({ chain, onError }) => {
  const chainUnitLabel = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.nativeCurrency.symbol;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain);

  if (isError) {
    onError?.(true);
    return (
      <p className="text-[20px] text-negative-11 font-bold">
        ruh roh, we couldn't load charge details for this chain!{" "}
        <button className="underline cursor-pointer" onClick={() => refetchChargeDetails()}>
          please try again
        </button>
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo-filled text-[20px] text-neutral-9">Loading charge fees</p>;
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <ContestParamsChargeSubmission chainUnitLabel={chainUnitLabel ?? ""} onError={onError} />
        <ContestParamsChargeVote chainUnitLabel={chainUnitLabel ?? ""} onError={onError} />
      </div>
    </div>
  );
};

export default CreateContestCharge;
