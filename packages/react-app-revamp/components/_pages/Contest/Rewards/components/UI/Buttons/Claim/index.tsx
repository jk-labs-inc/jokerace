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
      className={`bg-gradient-purple w-28 h-6 rounded-[40px] text-true-black text-[16px] font-bold hover:shadow-button-embossed-hover transition-all duration-300 ease-in-out ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      claim
    </button>
  );
};

export default RewardsClaimButton;
