import { Avatar } from "@components/UI/Avatar";
import { SIZES } from "@components/UI/UserProfileDisplay";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface ProposalContentProfileProps {
  name: string;
  avatar: string;
  isLoading: boolean;
  isError: boolean;
  size?: "extraSmall" | "small" | "medium" | "large";
  textColor?: string;
  dropShadow?: boolean;
}

const ProposalContentProfile: FC<ProposalContentProfileProps> = ({
  name,
  avatar,
  isLoading,
  isError,
  textColor,
  size = "small",
  dropShadow = false,
}) => {
  return (
    <>
      {isLoading ? (
        <Skeleton width={150} height={16} baseColor="#212121" highlightColor="#100816" />
      ) : isError ? (
        <p className="text-negative-11 font-bold text-[12px]">ruh-roh, couldn't load creator name!</p>
      ) : (
        <div className="flex gap-2 items-center">
          {avatar ? <Avatar src={avatar} size={size} /> : null}
          <p
            className={`font-bold ${SIZES[size].textSizeClass} ${textColor ? textColor : "text-neutral-11"} ${
              dropShadow ? "drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" : ""
            }`}
          >
            {name}
          </p>
        </div>
      )}
    </>
  );
};

export default ProposalContentProfile;
