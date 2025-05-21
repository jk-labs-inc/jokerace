import { FC } from "react";

interface RewardsClaimButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
}

const RewardsClaimButton: FC<RewardsClaimButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`bg-gradient-purple w-28 h-6 rounded-[40px] text-true-black text-[16px] font-bold ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      claim
    </button>
  );
};

export default RewardsClaimButton;
