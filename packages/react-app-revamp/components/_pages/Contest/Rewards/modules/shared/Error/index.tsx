interface RewardsErrorProps {
  onRetry?: () => void;
}

const RewardsError = ({ onRetry }: RewardsErrorProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[24px] text-negative-11 font-bold">ruh roh!</p>
      <p className="text-[16px] text-neutral-11">
        there was an error while loading the rewards module,{" "}
        <button className="text-negative-11 font-bold underline" onClick={onRetry}>
          please try again!
        </button>
      </p>
    </div>
  );
};

export default RewardsError;
