/* eslint-disable @next/next/no-img-element */
import { ROUTE_VIEW_USER } from "@config/routes";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useProfileData from "@hooks/useProfileData";
import { useMemo, useState } from "react";
import { Avatar } from "../Avatar";
import CustomLink from "../Link";
import ButtonV3, { ButtonSize } from "../ButtonV3";
import { useAccount } from "wagmi";
import { erc20ChainDropdownOptions } from "@components/_pages/Create/components/RequirementsSettings/config";

interface UserProfileDisplayProps {
  ethereumAddress: string;
  shortenOnFallback: boolean;
  textColor?: string;
  size?: "extraSmall" | "small" | "medium" | "large";
  textualVersion?: boolean;
  avatarVersion?: boolean;
  includeSocials?: boolean;
  includeSendFunds?: boolean;
  onSendFundsClick?: () => void;
}

export const SIZES = {
  extraSmall: {
    avatarSizeClass: "w-8 h-8",
    textSizeClass: "text-[12px]",
  },
  small: {
    avatarSizeClass: "w-8 h-8",
    textSizeClass: "text-[16px]",
  },
  medium: {
    avatarSizeClass: "w-14 h-14",
    textSizeClass: "text-[18px] font-sabo",
  },
  large: {
    avatarSizeClass: "w-[100px] h-[100px]",
    textSizeClass: "text-[24px] font-sabo",
  },
};

const UserProfileDisplay = ({
  textualVersion,
  avatarVersion,
  ethereumAddress,
  includeSocials,
  textColor,
  shortenOnFallback,
  size = "small",
  includeSendFunds,
  onSendFundsClick,
}: UserProfileDisplayProps) => {
  const { chain } = useAccount();
  const { profileName, profileAvatar, socials, isLoading } = useProfileData(
    ethereumAddress,
    shortenOnFallback,
    includeSocials,
  );
  const { avatarSizeClass, textSizeClass } = SIZES[size];
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const isChainSupportedForSendFunds = useMemo(() => {
    return erc20ChainDropdownOptions.some(option => option.value.toLowerCase() === chain?.name.toLowerCase());
  }, [chain]);

  if (textualVersion) {
    return (
      <CustomLink
        className={`text-[16px] font-bold ${textColor || "text-neutral-11"}`}
        target="_blank"
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
      >
        {profileName}
      </CustomLink>
    );
  }

  if (avatarVersion) {
    return (
      <CustomLink
        href={`${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
        className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}
      >
        <Avatar src={profileAvatar} size={size} />
      </CustomLink>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ethereumAddress);
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 1000);
  };

  return (
    <div
      className={`flex ${
        size === "large" ? "gap-6" : size === "medium" ? "gap-4" : "gap-2"
      } items-center ${textColor || "text-neutral-11"} font-bold`}
    >
      <div className={`flex items-center ${avatarSizeClass} bg-neutral-5 rounded-full overflow-hidden`}>
        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={profileAvatar} alt="avatar" />
      </div>
      {isLoading ? (
        <p className={`${textSizeClass} animate-flicker-infinite`}>Loading profile data</p>
      ) : (
        <div className="animate-reveal flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <a
              className={`no-underline ${textSizeClass} ${textColor || "text-neutral-11"} font-bold`}
              target="_blank"
              rel="noopener noreferrer"
              href={includeSocials ? undefined : `${ROUTE_VIEW_USER.replace("[address]", ethereumAddress)}`}
            >
              {profileName}
            </a>
            {isAddressCopied ? (
              <CheckCircleIcon className="w-4 h-4 text-positive-11" />
            ) : (
              <button className="flex lg:hidden items-center gap-1" onClick={copyToClipboard}>
                <img src="/icons/copy.svg" alt="link" className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {includeSocials ? (
              <div className="flex gap-2 items-center">
                <a href={socials?.etherscan} target="_blank">
                  <div className="w-6 h-6 flex justify-center items-center overflow-hidden rounded-full">
                    <img className="object-cover" src="/etherscan.svg" alt="Etherscan" />
                  </div>
                </a>

                {socials?.cluster ? (
                  <a href={socials.cluster} target="_blank">
                    <div className="w-6 h-6 flex justify-center items-center overflow-hidden rounded-full">
                      <img className="object-cover" src="/socials/cluster.png" alt="Cluster" />
                    </div>
                  </a>
                ) : null}
              </div>
            ) : null}
            {includeSendFunds && isChainSupportedForSendFunds ? (
              <ButtonV3
                onClick={onSendFundsClick}
                colorClass="bg-gradient-create"
                textColorClass="text-true-black rounded-[40px] text-[16px] font-bold"
              >
                send funds &gt;
              </ButtonV3>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDisplay;
